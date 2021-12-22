(async () => {
  const issuesResponse = await fetch('/data/latest/all_issues.json')
  const staleIssuesResponse = await fetch('/data/latest/stale_issues.json')
  const generalDataResponse = await fetch('/data/latest/general_data.json')
  const notificationsRecipientsResponse = await fetch('/data/notifications-recipients.json')

  const issues = await issuesResponse.json()
  const staleIssues = await staleIssuesResponse.json()
  const generalData = await generalDataResponse.json()
  const notificationsRecipients = await notificationsRecipientsResponse.json()

  // 'assignees' are used to filter assignees. We take 'notifications recipients' from 'notifications-recipients.json' and
  // glue them together with 'Show all' issues and 'No assignee' values.
  let assignees = [{name: 'Show all', value: 'SHOW_ALL'}, {name: 'No assignee', value: 'NO_ASSIGNEE'}]
  assignees = assignees.concat(notificationsRecipients.map(({name, githubLogin}) => ({name, value: githubLogin})))

  ReactDOM.render(<App
    issues={issues}
    staleIssues={staleIssues}
    generalData={generalData}
    assignees={assignees}
  />, document.querySelector('#app'))
})()
