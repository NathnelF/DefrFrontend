<script>
    import Report from './Report.svelte'
    //TODO: default to events from the current month / year
    //TODO: add date picker to choose the time period for the reports generated 
    const events = [
      {
        "contractId": 1,
        "amount": 0,
        "date": "2025-05-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2025-06-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2025-07-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2025-08-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2025-09-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2025-10-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2025-11-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2025-12-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2026-01-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2026-02-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2026-03-15T19:57:58.387"
      },
      {
        "contractId": 1,
        "amount": 0,
        "date": "2026-04-15T19:57:58.387"
      }
    ];
</script>

<Report events={events} />