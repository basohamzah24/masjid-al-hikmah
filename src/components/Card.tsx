interface CardProps {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function Card({ title, description, className = "", children, onClick }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className} ${
        onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {children}
    </div>
  );
}

// Default export untuk kompatibilitas
export default Card;