import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionTitle({ title, subtitle, centered = false, light = false }: SectionTitleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-8 ${centered ? 'text-center' : ''}`}
    >
      <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${light ? 'text-white' : 'text-[#1e3a5f]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-white/80' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
      <div className={`flex items-center gap-2 mt-4 ${centered ? 'justify-center' : ''}`}>
        <div className="w-12 h-1 bg-[#e67e22] rounded-full" />
        <div className="w-3 h-1 bg-[#27ae60] rounded-full" />
        <div className="w-3 h-1 bg-[#1e3a5f] rounded-full" />
      </div>
    </motion.div>
  );
}
