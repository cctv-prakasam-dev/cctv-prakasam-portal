import { nonEmpty, object, picklist, pipe, string } from "valibot";
export const VUpdateUserRoleSchema = object({
    user_type: pipe(string("User type must be a string"), nonEmpty("User type is required"), picklist(["SUPER_ADMIN", "ADMIN", "MANAGER", "CUSTOMER"], "User type must be one of: SUPER_ADMIN, ADMIN, MANAGER, CUSTOMER")),
});
