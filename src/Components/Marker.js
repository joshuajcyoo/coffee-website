export default function Marker({ longitude, latitude, color, onClick }) {
    const markerRef = useRef(null);
  
    useEffect(() => {
      const marker = new maptilersdk.Marker({ color })
        .setLngLat([longitude, latitude])
        .addTo(markerRef.current);
  
      if (onClick) {
        marker.on('click', onClick);
      }
  
      return () => {
        marker.remove();
      };
    }, [longitude, latitude, color, onClick]);
  
    return <div ref={markerRef} />;
  }