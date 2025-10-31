// Zmienne globalne z React i ReactDOM są dostępne po załadowaniu w index.html
const { useState, useEffect } = React;
const ReactDOMClient = ReactDOM;

// --- Constants ---
const availableLocations = ["Kluczbork", "Opole", "Rzeszów", "Racibórz/Kałków"];
const STORAGE_KEY = 'recruitmentScheduleData';

// --- Icons ---
// ... (Wszystkie ikony EditIcon, SaveIcon, CancelIcon pozostają bez zmian) ...
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
  );

  const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  const CancelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

// --- Components ---
// ... (Wszystkie komponenty ScheduleRow i ScheduleTable pozostają bez zmian) ...
const ScheduleRow = ({ entry, isEditing, onEdit, onCancel, onSave }) => {
    const [editedEntry, setEditedEntry] = useState(entry);

    useEffect(() => {
        setEditedEntry(entry);
    }, [entry, isEditing]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEntry(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        onSave(editedEntry);
    };

    const rowClasses = `bg-white hover:bg-blue-50 transition-colors duration-200`;
    const inputClass = "w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

    if (isEditing) {
        return (
            <tr className="bg-blue-100">
                <td className="px-6 py-4 whitespace-nowrap">
                    <input
                        type="text"
                        name="date"
                        value={editedEntry.date}
                        onChange={handleInputChange}
                        className={inputClass}
                        aria-label="Date"
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                        name="location" 
                        value={editedEntry.location} 
                        onChange={handleInputChange}
                        className={inputClass}
                        aria-label="Location"
                    >
                        {availableLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <input
                        type="text"
                        name="recruiter"
                        value={editedEntry.recruiter}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Brak"
                        aria-label="Recruiter"
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                        <button
                            onClick={handleSaveClick}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            title="Zapisz"
                            aria-label="Zapisz zmiany"
                        >
                            <SaveIcon />
                        </button>
                        <button
                            onClick={onCancel}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Anuluj"
                            aria-label="Anuluj edycję"
                        >
                            <CancelIcon />
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <tr className={rowClasses}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.date}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.location}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.recruiter || <span className="text-gray-400 italic">Brak</span>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => onEdit(entry.id)}
                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="Edytuj"
                    aria-label={`Edytuj wpis dla ${entry.date}`}
                >
                    <EditIcon />
                </button>
            </td>
        </tr>
    );
};

const ScheduleTable = ({ data, onUpdate }) => {
    const [editingRowId, setEditingRowId] = useState(null);

    const handleEdit = (id) => {
        setEditingRowId(id);
    };

    const handleCancel = () => {
        setEditingRowId(null);
    };

    const handleSave = (updatedEntry) => {
        onUpdate(updatedEntry);
        setEditingRowId(null);
    };

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Lokalizacja (Oddział)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Rekruter
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Akcje</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((entry) => (
                            <ScheduleRow
                                key={entry.id}
                                entry={entry}
                                isEditing={editingRowId === entry.id}
                                onEdit={handleEdit}
                                onCancel={handleCancel}
                                onSave={handleSave}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Local Storage Logic (Przeniesiona z poprzedniej odpowiedzi) ---

const loadScheduleFromStorage = (generatedSchedule) => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            
            const storedMap = new Map(parsedData.map(item => [item.id, item]));

            return generatedSchedule.map(generatedEntry => {
                const storedEntry = storedMap.get(generatedEntry.id);
                return storedEntry ? { 
                    ...generatedEntry, 
                    location: storedEntry.location, 
                    recruiter: storedEntry.recruiter 
                } : generatedEntry;
            });
        }
        return generatedSchedule;
    } catch (e) {
        console.error("Błąd ładowania danych z Local Storage:", e);
        return generatedSchedule;
    }
};

const saveScheduleToStorage = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Błąd zapisu danych do Local Storage:", e);
    }
};


// --- Main App Logic ---

const generateFridaysSchedule = () => {
    const fridays = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    let currentDate = new Date(today.getTime());

    while (currentDate.getDay() !== 5) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    while (currentDate.getFullYear() === currentYear) {
      const formattedDate = currentDate.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      
      fridays.push({
        id: `friday-${formattedDate}`,
        date: formattedDate,
        location: 'Kluczbork',
        recruiter: '',
      });
      
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return fridays;
};

const App = () => {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const generatedSchedule = generateFridaysSchedule();
    // Ładowanie danych z Local Storage
    setScheduleData(loadScheduleFromStorage(generatedSchedule));
  }, []);

  const handleUpdateEntry = (updatedEntry) => {
    setScheduleData(prevData => {
      const newData = prevData.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      );
      // Zapisywanie danych do Local Storage
      saveScheduleToStorage(newData);
      return newData;
    });
  };
  
  const Header = () => (
    <div className="text-center p-6 bg-white shadow-md rounded-lg mb-8">
      <h1 className="text-4xl font-bold text-gray-800">Harmonogram Rekrutacji</h1>
      <p className="text-gray-600 mt-2">Harmonogram na każdy piątek do końca roku. Zmiany zapisywane są lokalnie w przeglądarce.</p>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Header />
          <main>
            <ScheduleTable data={scheduleData} onUpdate={handleUpdateEntry} />
          </main>
        </div>
    </div>
  );
};

// --- Mount Application ---
const rootElement = document.getElementById('recruitment-schedule-root');
if (rootElement) {
    const root = ReactDOMClient.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
} else {
    console.error("Element #recruitment-schedule-root not found.");
}
