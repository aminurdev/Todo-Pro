export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to React Boilerplate
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        A modern React TypeScript boilerplate with Redux Toolkit, RTK Query,
        React Router, React Hook Form with Zod validation, Tailwind CSS, and MSW
        for API mocking.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Redux Toolkit</h3>
          <p className="text-gray-600">
            State management with slices and RTK Query
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">React Router</h3>
          <p className="text-gray-600">Protected routes and navigation</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">React Hook Form + Zod</h3>
          <p className="text-gray-600">Type-safe form validation</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Tailwind CSS</h3>
          <p className="text-gray-600">Utility-first CSS framework</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">MSW</h3>
          <p className="text-gray-600">API mocking for development</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Vitest + RTL</h3>
          <p className="text-gray-600">Modern testing setup</p>
        </div>
      </div>
    </div>
  );
}
