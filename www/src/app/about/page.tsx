import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export default function AboutPage() {
  return (
    <>
      <div className="page-header-container">
        <div className="container">
          <h1><FontAwesomeIcon icon={faCircleInfo} /> Terms of Service</h1>
          <p className="text-muted">Please read our terms carefully before using the pool.</p>
        </div>
      </div>

      <div className="container">
        <div className="panel panel-default">
          <div className="panel-body">
            <h3>Overview</h3>
            <p>
              VirBiCoin Pool (hereafter referred to as &quot;the Pool&quot;) is a service designed for <strong>decentralized mining</strong>, providing users with a high-performance mining environment. By using the Pool, users agree to accept all terms and risks outlined below.
            </p>

            <hr />

            <h3>Terms of Use</h3>
            <ul>
              <li><strong>Experimental Software Usage:</strong> The Pool utilizes software written in <strong>Go</strong>, designed to be highly concurrent and low in memory consumption. This software is still under development, meaning there may be unexpected bugs or errors. Users must accept all <strong>risks</strong> associated with using this experimental software.</li>
              <li><strong>Acceptance of Risk:</strong> Users acknowledge and accept all risks (e.g., hardware failure, network interruption, software bugs) related to the use of the Pool. By using the Pool, users agree <strong>not to seek compensation</strong> for any irreversible losses.</li>
              <li><strong>Liability of the Pool Owner:</strong> The Pool owner will make every effort to prevent the worst-case scenarios, but <strong>does not provide compensation</strong> for losses arising from inevitable events or issues. Users understand that there are no guarantees provided regarding the Pool&apos;s performance.</li>
            </ul>

            <hr />

            <h3>Features and Services</h3>
            <ul>
              <li><strong>High-Performance Proxy:</strong> The Pool utilizes a <strong>high-performance proxy server</strong> that allows for highly parallel processing and low latency. However, network conditions may still cause occasional delays.</li>
              <li><strong>Block Unlocking and Payout Module:</strong> The Pool has a <strong>block unlocking and payout module</strong> designed to distribute mining rewards fairly. <strong>Payout conditions</strong> must be met, and users are advised to review the guidelines for more information.</li>
              <li><strong>Fully Distributed Setup:</strong> The Pool is built on a <strong>100% distributed architecture</strong>, using multiple servers to ensure <strong>high availability</strong> and <strong>fault tolerance</strong>, distributing the load across various nodes to enhance the system&apos;s resilience.</li>
              <li><strong>Strict Policy Enforcement:</strong> Users must adhere to the <strong>strict policies</strong> of the Pool. These policies include rules for mining and measures to handle fraudulent activities. Violation of these policies may result in <strong>suspension or termination of user accounts</strong>.</li>
              <li><strong>Modern Ember.js Frontend:</strong> The Pool offers a <strong>modern, user-friendly interface</strong> built with <strong>Ember.js</strong>, allowing users to monitor their mining progress and rewards in real-time with an intuitive and visually appealing design.</li>
            </ul>

            <hr />

            <h3>Prohibited Activities</h3>
            <ul>
              <li><strong>Fraudulent Activities:</strong> Users agree not to engage in <strong>fraudulent activities</strong> such as unfair mining practices, hacking, or spamming. Any detected fraudulent behavior will result in <strong>immediate suspension of the user account</strong>, and legal action may be taken.</li>
              <li><strong>Handling of Personal Information:</strong> Users agree that their personal information provided during Pool usage will be handled according to the Pool&apos;s <strong>Privacy Policy</strong>. Please refer to the Privacy Policy for more details on how your personal data is managed.</li>
            </ul>

            <hr />

            <h3>Rewards and Payments</h3>
            <ul>
              <li><strong>Reward Distribution:</strong> The Pool distributes mining rewards <strong>proportionally</strong> based on the computational resources provided by each user. The <strong>calculation method</strong> for rewards is available in the official guide and is subject to change.</li>
              <li><strong>Minimum Payout Threshold:</strong> Users must meet a minimum payout threshold before rewards are distributed. This threshold may be changed at the discretion of the Pool owner.</li>
            </ul>

            <hr />

            <h3>Disclaimers</h3>
            <ul>
              <li><strong>Service Interruption or Suspension:</strong> The Pool may experience <strong>temporary service interruptions</strong> or downtime due to maintenance or unforeseen issues. In such cases, the Pool owner is not liable for any loss incurred by the user.</li>
              <li><strong>Third-Party Liability:</strong> If a user causes damage to a third party, the user will be held responsible, and the Pool owner will not be liable for any damages or legal consequences.</li>
            </ul>

            <hr />

            <h3>Changes to Terms</h3>
            <p>
              The Pool reserves the right to update or change these Terms of Service at any time. If changes are made, <strong>users will be notified</strong> through the official website and the Pool&apos;s notification system. Continued use of the service after the changes constitutes acceptance of the revised terms.
            </p>

            <hr />

            <h3>Governing Law and Jurisdiction</h3>
            <p>
              These Terms of Service are governed by the laws of <strong>Japan</strong>. Any disputes arising from the use of this service shall be subject to the exclusive jurisdiction of the <strong>Tokyo District Court</strong>.
            </p>

            <hr />

            <h3>Contact Information</h3>
            <p>
              For any inquiries or support requests, please contact us through <a href="https://x.com/VirBiCoin" target="_blank" rel="noopener noreferrer">X</a> or our Discord or our Telegram.
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 