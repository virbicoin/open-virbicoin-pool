"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function AccountLookupForm() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleLookup = () => {
    if (address) {
      router.push(`/account/${address}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  };

  return (
    <div className="panel card">
      <div className="panel-body">
        <h3 className="panel-title-lookup">
          <FontAwesomeIcon icon={faUserCircle} /> Your Stats &amp; Payment History
        </h3>
        <p className="text-muted">
          Enter your wallet address to check your stats.
        </p>
        <div className="input-group input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Your VirBiCoin Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleLookup}
            >
              <FontAwesomeIcon icon={faSearch} /> Lookup
            </button>
          </span>
        </div>
      </div>
    </div>
  );
} 