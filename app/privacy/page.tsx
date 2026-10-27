import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — VYBE CLUB",
  description:
    "How VYBE CLUB collects, uses and protects the information you share when joining the waitlist.",
};

const LAST_UPDATED = "27 October 2026";
const CONTACT_EMAIL = "info@vybeclub.co.in";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white px-5 sm:px-8 py-20">
      <article className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-widest text-[#FCCA59] hover:text-[#FED77A]"
        >
          ← Back to VYBE CLUB
        </Link>

        <h1 className="mt-8 text-4xl sm:text-5xl font-black uppercase tracking-tight font-[family-name:var(--font-syne)]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs font-mono text-white/40">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-8 text-sm sm:text-base leading-relaxed text-white/75 font-sans">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              1. Where we are today
            </h2>
            <p>
              VYBE CLUB is not live yet. Right now this website only collects
              waitlist sign-ups. We do not offer payments, wallets, cards or
              any financial service at this time, and we do not collect any
              payment or banking details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              2. What we collect
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your email address (required to join the waitlist).</li>
              <li>Your phone number (optional, only if you enter it).</li>
              <li>
                Your consent choice, the date and time of sign-up, and the
                waitlist pass number we assign to you.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              3. Why we use it
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To confirm your spot on the waitlist.</li>
              <li>
                To contact you about launch updates and early access to VYBE
                CLUB.
              </li>
              <li>To prevent duplicate sign-ups and abuse of the waitlist.</li>
            </ul>
            <p className="mt-2">
              We do not sell or rent your information, and we do not share it
              with advertising networks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              4. Who processes it for us
            </h2>
            <p>
              We use a hosted database provider to store waitlist records and
              an email service to send confirmation messages. These providers
              process data only to run those services for us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              5. How long we keep it
            </h2>
            <p>
              We keep waitlist records until you withdraw consent or ask us to
              delete them, or until we no longer need them for the purposes
              above.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              6. Your choices
            </h2>
            <p>
              You can withdraw consent, or ask to access, correct or delete
              your information at any time by emailing{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#FCCA59] underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
              . Include the email address you signed up with so we can find
              your record.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">7. Changes</h2>
            <p>
              If we change this policy, we will update the date above. If the
              changes are significant, we will let waitlist members know before
              they take effect.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
