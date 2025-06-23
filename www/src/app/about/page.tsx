export default function AboutPage() {
  return (
    <>
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-100">Terms of Service</h1>
          <p className="text-gray-400">Please read our terms carefully before using the pool.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">Overview</h3>
            <p className="text-gray-400">
              VirBiCoin Pool (hereafter referred to as &quot;the Pool&quot;) is a service designed for <strong className="text-gray-300">decentralized mining</strong>, providing users with a high-performance mining environment. By using the Pool, users agree to accept all terms and risks outlined below.
            </p>

            <hr className="my-6 border-gray-700" />

            <h3 className="text-xl font-semibold mb-4 text-gray-100">Terms of Use</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">Experimental Software Usage:</strong> The Pool utilizes software written in <strong className="text-gray-300">Go</strong>, designed to be highly concurrent and low in memory consumption. This software is still under development, meaning there may be unexpected bugs or errors. Users must accept all <strong className="text-gray-300">risks</strong> associated with using this experimental software.</li>
              <li><strong className="text-gray-300">Acceptance of Risk:</strong> Users acknowledge and accept all risks (e.g., hardware failure, network interruption, software bugs) related to the use of the Pool. By using the Pool, users agree <strong className="text-gray-300">not to seek compensation</strong> for any irreversible losses.</li>
              <li><strong className="text-gray-300">Liability of the Pool Owner:</strong> The Pool owner will make every effort to prevent the worst-case scenarios, but <strong className="text-gray-300">does not provide compensation</strong> for losses arising from inevitable events or issues. Users understand that there are no guarantees provided regarding the Pool&apos;s performance.</li>
            </ul>

            <hr className="my-6 border-gray-700" />

            <h3 className="text-xl font-semibold mb-4 text-gray-100">Features and Services</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">High-Performance Proxy:</strong> The Pool utilizes a <strong className="text-gray-300">high-performance proxy server</strong> that allows for highly parallel processing and low latency. However, network conditions may still cause occasional delays.</li>
              <li><strong className="text-gray-300">Block Unlocking and Payout Module:</strong> The Pool has a <strong className="text-gray-300">block unlocking and payout module</strong> designed to distribute mining rewards fairly. <strong className="text-gray-300">Payout conditions</strong> must be met, and users are advised to review the guidelines for more information.</li>
              <li><strong className="text-gray-300">Fully Distributed Setup:</strong> The Pool is built on a <strong className="text-gray-300">100% distributed architecture</strong>, using multiple servers to ensure <strong className="text-gray-300">high availability</strong> and <strong className="text-gray-300">fault tolerance</strong>, distributing the load across various nodes to enhance the system&apos;s resilience.</li>
              <li><strong className="text-gray-300">Strict Policy Enforcement:</strong> Users must adhere to the <strong className="text-gray-300">strict policies</strong> of the Pool. These policies include rules for mining and measures to handle fraudulent activities. Violation of these policies may result in <strong className="text-gray-300">suspension or termination of user accounts</strong>.</li>
              <li><strong className="text-gray-300">Modern Next.js Frontend:</strong> The Pool offers a <strong className="text-gray-300">modern, user-friendly interface</strong> built with <strong className="text-gray-300">Next.js</strong>, allowing users to monitor their mining progress and rewards in real-time with an intuitive and visually appealing design.</li>
            </ul>

            <hr className="my-6 border-gray-700" />

            <h3 className="text-xl font-semibold mb-4 text-gray-100">Prohibited Activities</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">Fraudulent Activities:</strong> Users agree not to engage in <strong className="text-gray-300">fraudulent activities</strong> such as unfair mining practices, hacking, or spamming. Any detected fraudulent behavior will result in <strong className="text-gray-300">immediate suspension of the user account</strong>, and legal action may be taken.</li>
              <li><strong className="text-gray-300">Handling of Personal Information:</strong> Users agree that their personal information provided during Pool usage will be handled according to the Pool&apos;s <strong className="text-gray-300">Privacy Policy</strong>. Please refer to the Privacy Policy for more details on how your personal data is managed.</li>
            </ul>

            <hr className="my-6 border-gray-700" />

            <h3 className="text-xl font-semibold mb-4 text-gray-100">Rewards and Payments</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">Reward Distribution:</strong> The Pool distributes mining rewards <strong className="text-gray-300">proportionally</strong> based on the computational resources provided by each user. The <strong className="text-gray-300">calculation method</strong> for rewards is available in the official guide and is subject to change.</li>
              <li><strong className="text-gray-300">Minimum Payout Threshold:</strong> Users must meet a minimum payout threshold before rewards are distributed. This threshold may be changed at the discretion of the Pool owner.</li>
            </ul>

            <hr className="my-6 border-gray-700" />

            <h3 className="text-xl font-semibold mb-4 text-gray-100">Disclaimers</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">Service Interruption or Suspension:</strong> The Pool may experience <strong className="text-gray-300">temporary service interruptions</strong> or downtime due to maintenance or unforeseen issues. In such cases, the Pool owner is not liable for any loss incurred by the user.</li>
              <li><strong className="text-gray-300">Third-Party Liability:</strong> If a user causes damage to a third party, the user will be held responsible, and the Pool owner will not be liable for any damages or legal consequences.</li>
            </ul>

            <hr className="my-6 border-gray-700" />

            <h3 className="text-xl font-semibold mb-4 text-gray-100">Changes to Terms</h3>
            <p className="text-gray-400">
              The Pool reserves the right to update or change these Terms of Service at any time. If changes are made, <strong className="text-gray-300">users will be notified</strong> through the official website and the Pool&apos;s notification system. Continued use of the service after the changes constitutes acceptance of the revised terms.
            </p>

            <hr className="my-6 border-gray-700" />

            <h3 className="text-xl font-semibold mb-4 text-gray-100">Governing Law and Jurisdiction</h3>
            <p className="text-gray-400">
              These Terms of Service are governed by the laws of <strong className="text-gray-300">Japan</strong>. Any disputes arising from the use of this service shall be subject to the exclusive jurisdiction of the <strong className="text-gray-300">Tokyo District Court</strong>.
            </p>

            <hr className="my-6 border-gray-700" />

            <h3 className="text-xl font-semibold mb-4 text-gray-100">Contact Information</h3>
            <p className="text-gray-400">
              For any inquiries or support requests, please contact us through <a href="https://x.com/VirBiCoin" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gray-100 transition-colors">X</a> or our Discord or our Telegram.
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 