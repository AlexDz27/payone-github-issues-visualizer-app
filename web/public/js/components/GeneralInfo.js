function GeneralInfo({ generalData }) {
  return (
    <div>
      <h2>General info:</h2>
      <ul>
        <li>Data retrieval time (UTC):<br /> <b>{generalData.retrieval_date_utc}</b></li>
        <li>Issues total: <b>{generalData.issues_total}</b></li>
        <li>Stale issues total: <b>{generalData.stale_issues_total}</b></li>
        <li>Issues per repository: <ul>
          {
            Object.entries(generalData.issues_count_per_repository)
              .sort((itemA, itemB) => itemB[1] - itemA[1])
              .map(item => (<li>{item[0]}: <b>{item[1]}</b></li>))
          }
        </ul></li>
      </ul>
    </div>
  )
}