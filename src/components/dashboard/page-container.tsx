interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={`space-y-4 p-8 pt-6 ${className || ""}`}>{children}</div>
  );
}
