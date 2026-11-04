import type { ReactNode } from "react";

type EditorialPageProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
};

export function EditorialPage({ eyebrow, title, description, children }: EditorialPageProps) {
  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <header className="editorial-page-hero">
          <p className="editorial-eyebrow">{eyebrow}</p>
          <h1 className="editorial-page-title max-w-5xl">{title}</h1>
          {description && <div className="mt-7 max-w-3xl text-lg leading-8 text-[#171713]/70">{description}</div>}
        </header>
        {children}
      </div>
    </div>
  );
}
