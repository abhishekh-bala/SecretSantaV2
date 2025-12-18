/*
  # Remove Delete Policy from Assignments Table

  ## Issue
  The `"Public can delete assignments"` policy allows anyone to delete any assignment record,
  which is why assignments were disappearing after being created.

  ## Fix
  - Drop the DELETE policy from assignments table
  - Assignments should never be deletable by public users
  - Only allow admin to reset assignments through the resetAssignments function
  - Assignments can only be deleted when guides are reset by admin
*/

DROP POLICY IF EXISTS "Public can delete assignments" ON assignments;
