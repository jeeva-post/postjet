// ఈ లైన్ ఖచ్చితంగా మొదటి లైన్ గా ఉండాలి
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-blue-600">PostJet is Ready!</h1>
      <p className="mt-4 text-lg text-gray-700">మనం సక్సెస్ అయ్యాం జీవన్! ఇక లాగిన్ ట్రై చెయ్యి.</p>
      <a 
        href="/auth/signin" 
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Login to App
      </a>
    </main>
  );
}