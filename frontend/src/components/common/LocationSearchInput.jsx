import React, { useEffect } from 'react';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';
import { MapPin, Loader, Navigation } from 'lucide-react';

const libraries = ['places'];

const LocationSearchInput = ({
    label,
    value,
    onChange,
    onLocationSelect,
    placeholder,
    error,
}) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    if (loadError) return <div className="text-red-500 text-sm">Error loading Maps API</div>;
    if (!isLoaded) return <div className="text-gray-500 text-sm flex items-center gap-2"><Loader className="animate-spin w-4 h-4" /> Loading Maps...</div>;

    return (
        <PlacesAutocomplete
            label={label}
            value={value}
            onChange={onChange}
            onLocationSelect={onLocationSelect}
            placeholder={placeholder}
            error={error}
        />
    );
};

const PlacesAutocomplete = ({
    label,
    value,
    onChange,
    onLocationSelect,
    placeholder,
    error,
}) => {
    const {
        ready,
        value: searchValue,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope here */
        },
        debounce: 300,
        defaultValue: value?.address || '',
    });

    useEffect(() => {
        if (value?.address && value.address !== searchValue) {
            setValue(value.address, false);
        }
    }, [value, setValue]);

    const handleInput = (e) => {
        setValue(e.target.value);
        onChange(e); // Propagate text change if needed
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            onLocationSelect({
                address,
                latitude: lat,
                longitude: lng,
            });
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
                        );
                        const data = await response.json();
                        if (data.results[0]) {
                            const address = data.results[0].formatted_address;
                            setValue(address, false);
                            onLocationSelect({
                                address,
                                latitude,
                                longitude,
                            });
                        }
                    } catch (error) {
                        console.error('Geocoding error:', error);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Unable to retrieve your location');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative flex gap-2">
                <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        value={searchValue}
                        onChange={handleInput}
                        disabled={!ready}
                        placeholder={placeholder || 'Search address...'}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                    {status === 'OK' && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                            {data.map(({ place_id, description }) => (
                                <li
                                    key={place_id}
                                    onClick={() => handleSelect(description)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                                >
                                    {description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleCurrentLocation}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    title="Use Current Location"
                >
                    <Navigation className="w-5 h-5" />
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default LocationSearchInput;
