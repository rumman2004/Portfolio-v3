import React from 'react';
import Card from '../../UI/Card';
import Badge from '../../UI/Badge';
import { Trophy } from 'lucide-react';

const HackathonCard = ({ hackathon }) => {
  return (
    <Card className="p-6 relative overflow-hidden group" glass hover>
      {/* Background Icon */}
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:-translate-y-2">
        <Trophy className="w-32 h-32 text-emerald-500" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-xl font-bold text-white max-w-[75%]">{hackathon.name}</h4>
          <Badge variant="success" className="shrink-0">{hackathon.rank}</Badge>
        </div>
        
        <p className="text-neutral-400 text-sm mb-4">
          {hackathon.date}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
            {hackathon.tech}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default HackathonCard;
