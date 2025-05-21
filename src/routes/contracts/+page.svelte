<script>
    import ContractTable from "./ContractTable.svelte";
    const contracts = [
        {
            "id": 1,
            "customerId": 1,
            "serviceId": 1,
            "price": 5000,
            "currentTermStart": "2025-05-20T17:32:14.086",
            "currentTermEnd": "2026-05-19T17:32:14.086",
            "termLength": 12,
            "originalContractStart": "2025-05-20T17:32:14.086",
            "invoiceDate": null,
            "isAutoRenew": true,
            "isChurned": false
        },
        {
            "id": 2,
            "customerId": 1,
            "serviceId": 1,
            "price": 1000,
            "currentTermStart": "2024-05-20T17:31:16.333",
            "currentTermEnd": "2025-05-19T17:31:16.333",
            "termLength": 12,
            "originalContractStart": "2024-05-20T17:31:16.333",
            "invoiceDate": null,
            "isAutoRenew": true,
            "isChurned": null
        }
    ];

    const names = {
        customerName: "Test Customer",
        serviceName: "Test Service"
    };

</script>

<ContractTable contracts={contracts} names={names} />