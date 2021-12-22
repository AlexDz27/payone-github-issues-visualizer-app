/*
  Purpose of this code - get latest data on our issues, i.e:
    1. Grab issues' data from Github
    2. Parse the data
    3. Move old latest data to '_previous/' folder. Just in case
    4. Compute stale issues
    5. Put the processed data into data/latest folder
*/
// The steps are represented with this syntax - /*** ***/

const { ROOT_PATH, DATA_PATH, PAYONE_ACCOUNT } = require('../../globals')
require('dotenv').config({ path: ROOT_PATH + '/commands/.env' })
const { APP_ID, PRIVATE_KEY, INSTALLATION_ID } = process.env

const { ProbotOctokit } = require('probot')
const fs = require('fs');
const { trimText, getDateStringifiedToISO8601, getDateUTCStringifiedToNiceFormat } = require('../functions/functions');

(async () => {
  /*** Grab issues' data from Github ***/
  const octokit = new ProbotOctokit({
    auth: {
      appId: APP_ID,
      privateKey: PRIVATE_KEY,
      installationId: INSTALLATION_ID
    }
  })

  const rawRepos = await octokit.repos.listForOrg({
    org: PAYONE_ACCOUNT,
  })

  /*** Parse the data ***/
  const repos = rawRepos.data.map(repo => repo.name)

  let generalData = {
    repositories_with_issues: [],
    issues_count_per_repository: {},
    issues_total: 0,
    stale_issues_total: 0,
    retrieval_date_utc: ''
  }
  const reposWithIssues = new Set()

  let allIssues = []
  for (const repo of repos) {
    const repoIssuesWithPullRequests = await octokit.paginate(octokit.issues.listForRepo, {
      owner: PAYONE_ACCOUNT,
      repo: repo,
      state: 'open',
    })

    let repoIssues = repoIssuesWithPullRequests.filter(issue => !issue.hasOwnProperty('pull_request'))
    let repoName
    if (repoIssues.length !== 0) {
      const repoNameSplit = repoIssues[0].repository_url.split('/')
      repoName = repoNameSplit[repoNameSplit.length - 1]
      reposWithIssues.add(repoName)
    }

    repoIssues = repoIssues.map(issue => ({
      title: issue.title,
      url: issue.html_url,
      repository: repoName,
      body: trimText(issue.body),
      assignee: issue.assignee ? {login: issue.assignee.login, avatar_url: issue.assignee.avatar_url} : null,
      updated_at: getDateUTCStringifiedToNiceFormat(new Date(issue.updated_at))
    }))

    if (repoName !== undefined) {
      generalData.issues_count_per_repository[repoName] = repoIssues.length
    }

    allIssues.push(repoIssues)
  }
  allIssues = allIssues.flat()

  generalData.repositories_with_issues = Array.from(reposWithIssues)
  generalData.issues_total = allIssues.length

  /*** Move old latest data to '_previous/' folder. Just in case ***/
  fs.renameSync(DATA_PATH + '/latest/all_issues.json', DATA_PATH + '/_previous/all_issues.json')
  fs.renameSync(DATA_PATH + '/latest/stale_issues.json', DATA_PATH + '/_previous/stale_issues.json')
  fs.renameSync(DATA_PATH + '/latest/general_data.json', DATA_PATH + '/_previous/general_data.json')

  /*** Compute stale issues ***/
  const now = new Date()
  const fourWeeksAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7 * 4, now.getHours(), now.getMinutes(), now.getSeconds())
  const staleIssues = allIssues.filter(issue => new Date(issue.updated_at) < fourWeeksAgo)
  generalData.stale_issues_total = staleIssues.length
  generalData.retrieval_date_utc = getDateUTCStringifiedToNiceFormat(now)

  /*** Put the processed data into data/latest folder ***/
  fs.writeFileSync(DATA_PATH + '/latest/all_issues.json', JSON.stringify(allIssues, null, 2))
  fs.writeFileSync(DATA_PATH + '/latest/stale_issues.json', JSON.stringify(staleIssues, null, 2))
  fs.writeFileSync(DATA_PATH + '/latest/general_data.json', JSON.stringify(generalData, null, 2))
})()
