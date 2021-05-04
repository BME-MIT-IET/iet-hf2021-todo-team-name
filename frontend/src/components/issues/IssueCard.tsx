import { EuiBadge, EuiCard, EuiIcon } from "@elastic/eui";
import moment from "moment";
import React, { ReactNode } from "react";
import { Issue } from "../../api/issue";
import styles from "../../styles/issues.module.css";
import labelAPI from "../../api/label";

interface IssueCardProps {
  issue: Issue;
  openModal?: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, openModal }) => {
  let description: ReactNode | string = "";
  if (issue.relevantClass) {
    let deadline = issue.deadline ? moment(issue.deadline) : null;

    description = (
      <>
        <span style={{ color: `${issue.relevantClass.color}` }}>
          {issue.relevantClass.name}
        </span>
        {issue.deadline && (
          <>
            <br />
            <EuiBadge>{deadline.format("YYYY. MM. DD. HH:mm")}</EuiBadge>
          </>
        )}
      </>
    );
  } else if (issue.deadline) {
    description = issue.deadline;
  }
  return (
    <EuiCard
      title={
        issue.body ? (
          <>
            {issue.title}
            <EuiIcon type="document" className={styles.icon} />
          </>
        ) : (
          issue.title
        )
      }
      description={description}
      titleSize="xs"
      className={styles.issueCard}
      onClick={openModal}
    >
      <>
        {issue.labels?.map((label) => (
          <EuiBadge
            color={
              labelAPI.colors.find((color) => color.value === label.type)
                ?.color || "hollow"
            }
          >
            {label.name}
          </EuiBadge>
        ))}
      </>
    </EuiCard>
  );
};
