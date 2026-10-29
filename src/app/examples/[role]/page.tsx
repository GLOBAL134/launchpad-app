import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SEO_RESUME_EXAMPLES, getResumeExampleBySlug } from "@/data/seo-resume-examples";
import ExampleDetailClient from "@/components/ExampleDetailClient";

export async function generateStaticParams() {
  return SEO_RESUME_EXAMPLES.map((ex) => ({
    role: ex.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role } = await params;
  const example = getResumeExampleBySlug(role);
  if (!example) return { title: "Резюме не найдено | LaunchPad AI PRO" };

  return {
    title: `${example.roleRu} — Пример резюме с рейтингом 95% ATS | LaunchPad`,
    description: example.metaDescriptionRu,
    openGraph: {
      title: `${example.roleRu} — Образец резюме 95% ATS`,
      description: example.metaDescriptionRu,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${example.roleRu} — Образец резюме 95% ATS`,
      description: example.metaDescriptionRu,
    },
  };
}

export default async function ExampleDetailPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const example = getResumeExampleBySlug(role);

  if (!example) {
    notFound();
  }

  return <ExampleDetailClient example={example} />;
}
