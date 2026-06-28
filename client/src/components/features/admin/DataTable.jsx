import React from 'react';
import Loader from '../../UI/Loader';
import { Trash2, Edit } from 'lucide-react';

const DataTable = ({ 
  columns, 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  emptyMessage = "No records found." 
}) => {
  if (loading) return <Loader />;

  const dropClass = "bg-[#e6edf5] shadow-[6px_6px_12px_#c8d0da,-6px_-6px_12px_#ffffff] rounded-2xl";
  const btnClass = "flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-blue-500 shadow-[4px_4px_8px_#c8d0da,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_5px_#c8d0da,inset_-2px_-2px_5px_#ffffff] transition-all";

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className={dropClass + " w-full p-8 text-center"}>
        <p className="text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-12">
      {data.map((row, rowIdx) => (
        <div key={row._id || row.id || rowIdx} className={dropClass + " flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 overflow-hidden min-w-0"}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1 min-w-0">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{col.header}</span>
                <div className="text-gray-800 font-medium min-w-0 break-words">
                  {col.render ? col.render(row) : row[col.accessor]}
                </div>
              </div>
            ))}
          </div>

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-3 shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-white/50">
              {onEdit && (
                <button 
                  onClick={() => onEdit(row)} 
                  className={btnClass}
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={() => onDelete(row._id || row.id)} 
                  className={btnClass + " hover:text-red-500"}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DataTable;
