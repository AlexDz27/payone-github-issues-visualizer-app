function ControlsPane({ assignees, handleShowOnlyStaleChange, handleChangeFilterAssignee, shouldFilterAssigneeBeChecked }) {
  return (
    <div>
      <form style={{maxWidth: 'fit-content'}}>
        <p>
          <label style={{marginRight: 10, fontSize: '1.5rem'}} htmlFor="showOnlyStale">Show only stale issues</label>
          <input onChange={handleShowOnlyStaleChange} id="showOnlyStale" type="checkbox" />
        </p>

        <p>
          <span style={{fontSize: '1.5rem'}}>Show issues by assignee:</span><br />
          {assignees.map(assignee => (
            <div style={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
              <label>{assignee.name} {' '}
                <input
                  type="radio" name="assignee"
                  onChange={() => handleChangeFilterAssignee(assignee)}
                  checked={shouldFilterAssigneeBeChecked(assignee)}
                />
              </label>
            </div>
          ))}
        </p>
      </form>
    </div>
  )
}