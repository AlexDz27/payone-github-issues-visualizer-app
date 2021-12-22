const { useState } = React

function App({ issues, staleIssues, generalData, assignees }) {
  const [showOnlyStale, setShowOnlyStale] = useState(false)
  const [filterAssignee, setFilterAssignee] = useState('SHOW_ALL')

  return (
    <div className="app">
      <div className="container mb-5">
        <h1 className="text-center mt-3">Our Github issues</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-3">
            <ControlsPane
              assignees={assignees}
              handleShowOnlyStaleChange={() => setShowOnlyStale(!showOnlyStale)}
              handleChangeFilterAssignee={assignee => setFilterAssignee(assignee.value)}
              shouldFilterAssigneeBeChecked={assignee => assignee.value === filterAssignee}
            />

            <br />
            <GeneralInfo generalData={generalData} />
          </div>
          <div className="col-9">
            <div className="container">
              <IssuesList issues={issues} staleIssues={staleIssues} showOnlyStale={showOnlyStale} filterAssignee={filterAssignee} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
