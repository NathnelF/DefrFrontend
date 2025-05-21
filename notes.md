

Each contract has an invoice date. It may be null if it hasn't been set.

The invoice date affects how the recognition schedule is generated. 

If there is no invoice date, the balance will be added to the first date. 

If there is an invoice date the balance will be added at the invoice date.

If the invoice date is before the first date a new event before the first date must be generated.

If the inboice date is after the last date (THIS SHOULD THEORETICALLY NEVER HAPPEN) then a new event after the last date must be generated.

The page will need to rerender all the dates following an update.

The invoice date updater will need to update the contracts invoice date, and then update the recogntion schedule and rerender it.

Upon loading the schedule page it should check if any events exist. If they do render those.

If they don't trigger the generate schedudle page and render those.

