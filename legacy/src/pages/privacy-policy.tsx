import { CustomPage } from "~/components/CustomPage";

export default function PrivacyPolicyPage() {
  return (
    <CustomPage mainHeading="Privacy Policy">
      <div className="text-l my-4 flex flex-col gap-8 text-white">
        <h2 className={`text-2xl`}>Does this site collect anonymous data?</h2>
        <p>
          When you use the ariastale.com website, we may collect some anonymous
          data to understand how users interact with the site. Such information
          may include the browser you are using and which pages you have
          visited.
        </p>

        <h2 className={`text-2xl`}>
          In what situations does ariastale.com collect personal data?
        </h2>
        <p>
          If you create an ariastale.com account, we collect your name and email
          address for authentication purposes and to personalize your
          experience. If you create an account through a third party
          authentication provider such as Google or Facebook, we will also
          attempt to collect a copy of your public profile picture for display
          on your Aria's Tale public profile, if enabled.
        </p>

        <h2 className={`text-2xl`}>Can I use this site anonymously?</h2>
        <p>
          Yes, you can access ariastale.com without creating an account. Without
          an account, no personal data about you is collected, although some
          features will be unavailable to you, such as collecting game items.
        </p>

        <h2 className={`text-2xl`}>
          If I create an account, what data will you collect?
        </h2>
        <p>A valid email address is required to create an account.</p>

        <h2 className={`text-2xl`}>
          Can any other organizations access my data?
        </h2>
        <p>
          We do not sell your data, though we do utilize some third party tools.
          For example, ariastale.com utilizes Vercel and Supabase. You can check
          their respective privacy policies for assurance.
        </p>

        <p>
          In addition, ariastale.com is maintained by the ladderly.io community,
          an open-source educational platform. Ladderly administrators may
          access your account details if you require tech support. View the
          <a href="https://www.ladderly.io/privacy-policy" target="_blank">
            ladderly.io privacy policy here
          </a>
          .
        </p>

        <h2 className={`text-2xl`}>
          I have additional questions about my privacy
        </h2>
        <p>We're here to help! Reach out to admin@ladderly.io.</p>

        <h2 className={`text-2xl`}>
          How can I find out about changes to this policy?
        </h2>
        <p>
          This version of the policy was last updated on 1/13/2023. Keep an eye
          on your email inbox for future updates and changes!
        </p>
      </div>
    </CustomPage>
  );
}
