import { email, nonEmpty, object, pipe, pipeAsync, rawTransformAsync, string } from "valibot";
import { newsletterEmailExists } from "../../validations/customValidations.js";
import { prepareValibotIssue } from "../../validations/prepareValibotIssue.js";
export const VSubscribeNewsletterSchema = pipeAsync(object({
    email: pipe(string("Email must be a string"), nonEmpty("Email is required"), email("Invalid email format")),
}), rawTransformAsync(async ({ dataset, addIssue }) => {
    const { email: emailValue } = dataset.value;
    const alreadySubscribed = await newsletterEmailExists(emailValue);
    if (alreadySubscribed) {
        prepareValibotIssue(dataset, addIssue, "email", emailValue, "This email is already subscribed to the newsletter");
    }
    return dataset.value;
}));
