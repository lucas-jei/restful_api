type StatusMessageProps = {
  type: "success" | "error";
  message: string;
};

function StatusMessage({ type, message }: StatusMessageProps) {
  return <p className={`status ${type}`}>{message}</p>;
}

export default StatusMessage;
