import React from 'react';
import { format } from 'date-fns';

const JournalEntry = ({ entry }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {format(new Date(entry.date), 'MMMM d, yyyy')}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl">{entry.mood.emoji}</span>
            <span className="text-gray-600">Productivity: {entry.productivityRating}/10</span>
          </div>
        </div>
      </div>
      
      <div className="prose max-w-none" 
           dangerouslySetInnerHTML={{ __html: entry.content }} 
      />

      {entry.attachments && entry.attachments.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.attachments.map((attachment, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(attachment)}
                alt={`Attachment ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalEntry;