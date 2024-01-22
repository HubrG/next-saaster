type Props = {
  children: React.ReactNode;
};
export const AdminWrapper = ({ children }: Props) => {
  return (
    <div>
      <div className="grid grid-cols-12 gap-10">{children}</div>
    </div>
  );
};
