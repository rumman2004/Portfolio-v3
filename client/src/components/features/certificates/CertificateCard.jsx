import React from 'react';
import Card from '../../UI/Card';
import Button from '../../UI/Button';
import { Award, ExternalLink } from 'lucide-react';

const CertificateCard = ({ certificate }) => {
  return (
    <Card className="flex flex-col h-full group border border-gray-200 hover:border-gray-300 bg-white shadow-sm" hover glass={false}>
      {certificate.image ? (
        <div className="h-48 w-full overflow-hidden bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-center">
          <img 
            src={certificate.image} 
            alt={certificate.name} 
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
      ) : (
        <div className="h-32 w-full bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-100 flex items-center justify-center">
          <Award className="w-12 h-12 text-amber-500/50" />
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-amber-500 transition-colors">
          {certificate.name}
        </h4>
        <p className="text-gray-600 text-sm mb-4">{certificate.issuer}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">{certificate.date}</span>
          
          {certificate.url && (
            <a href={certificate.url} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm" className="px-2">
                <span className="text-amber-400 text-sm flex items-center gap-1">Verify <ExternalLink className="w-3 h-3" /></span>
              </Button>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CertificateCard;
