function IssuesList({ issues, staleIssues, showOnlyStale, filterAssignee }) {
  let lastIteratedRepo = ''

  let issuesToRender = showOnlyStale ? staleIssues : issues
  issuesToRender = issuesToRender.filter((issue) => {
    switch (filterAssignee) {
      case 'SHOW_ALL':
        return true

      case 'NO_ASSIGNEE':
        return issue.assignee === null

      default:
        if (issue.assignee === null) return

        return issue.assignee.login === filterAssignee
    }
  })

  return (
    <div>
      {issuesToRender.map(issue => {
        let repositoryName
        if (lastIteratedRepo !== issue.repository) {
          lastIteratedRepo = issue.repository
          repositoryName = <h3>{issue.repository}</h3>
        }

        return (
          <div className="row mb-3">
            {repositoryName}
            <div className="card">
              <div className="card-body">
                <div className="container p-0">
                  <div className="row">
                    <div className={`col-10 ${issue.assignee && 'd-flex align-items-center'}`}>
                      <h5 className="card-title"><a href={issue.url} target="_blank">{issue.title}</a></h5>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                      {issue.assignee && <img src={issue.assignee.avatar_url} className="img-thumbnail rounded-circle" style={{maxHeight: 50}} />}
                    </div>
                  </div>
                </div>
                <p className="card-text">{issue.body}</p>
                <small>Issue last updated at {issue.updated_at}</small>
              </div>
            </div>
          </div>
        )})}
    </div>
  )
}