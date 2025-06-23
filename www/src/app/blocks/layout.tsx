import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { getStats } from '@/lib/api';
import BlocksTabs from "@/components/BlocksTabs";

export default async function BlocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getStats();
  return (
    <div>
      <div className="page-header-container">
        <div className="container">
          <h1>
            <FontAwesomeIcon icon={faCubes} /> Pool Blocks
          </h1>
          <p className="text-muted">
            Full block rewards, including TX fees and uncle rewards, are always
            paid out.
          </p>
        </div>
      </div>

      <div className="container">
        {/* We can implement the luck partial later */}
        {/* {{#if model.luck}}
          {{partial "luck"}}
        {{/if}} */}

        <div className="panel card">
          <div className="panel-heading">
            <BlocksTabs />
          </div>
          <div className="panel-body">
            <div className="tab-content" style={{ marginTop: '20px' }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 