export default function Section({
  title,
  content,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-7 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
        {title}
      </h3>

      <p className="text-gray-700 leading-8">
        {content}
      </p>
    </div>
  );
}