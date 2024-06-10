import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents, Polyline } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icon issue with default marker
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Bai5 = () => {
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [route, setRoute] = useState([]);
  const [isSettingStart, setIsSettingStart] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const latlng = [latitude, longitude];
        setCurrentPosition(latlng);

        // Fetch address using reverse geocoding
        const address = await fetchAddress(latlng);
        setCurrentAddress(address);
      },
      (error) => {
        console.error('Error fetching current position:', error);
      }
    );
  }, []);

  const fetchRoute = async (start, end) => {
    const apiKey = '5b3ce3597851110001cf6248edf09ad46f2849908b20481f6fadc854'; // Thay thế bằng API key của bạn
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

    try {
      const response = await axios.get(url);
      const coordinates = response.data.features[0].geometry.coordinates;
      const latlngs = coordinates.map(coord => [coord[1], coord[0]]);
      setRoute(latlngs);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const fetchAddress = async (latlng) => {
    const apiKey = '5b3ce3597851110001cf6248edf09ad46f2849908b20481f6fadc854'; // Thay thế bằng API key của bạn
    const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lat=${latlng.lat}&point.lon=${latlng.lng}`;

    try {
      const response = await axios.get(url);
      const address = response.data.features[0].properties.label;
      return address;
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Không thể lấy địa chỉ';
    }
  };

  const handleMapClick = async (e) => {
    const latlng = e.latlng;
    const address = await fetchAddress(latlng);

    if (isSettingStart) {
      setStartPosition(latlng);
      form.setFieldsValue({ start: address });
      setIsSettingStart(false);
    } else {
      setEndPosition(latlng);
      form.setFieldsValue({ end: address });
      setIsSettingStart(true);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const onFinish = () => {
    fetchRoute(startPosition, endPosition);
  };

  return (
    <>
      <Row gutter={20} style={{ padding: '20px' }}>
        <Col xs={24} md={12}>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item label="Bắt đầu" name="start" rules={[{ required: true, message: 'Vui lòng nhập điểm bắt đầu!' }]}>
              <Input placeholder="Nhập điểm bắt đầu" />
            </Form.Item>
            <Form.Item label="Kết thúc" name="end" rules={[{ required: true, message: 'Vui lòng nhập điểm kết thúc!' }]}>
              <Input placeholder="Nhập điểm kết thúc" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Đường đi</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={24} md={12} style={{ height: '400px' }}>
          <MapContainer center={currentPosition || [21.0043212, 105.8429686]} zoom={15} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {startPosition && (
              <Marker position={startPosition}>
                <Popup>
                  Điểm bắt đầu: {startPosition.lat}, {startPosition.lng}
                </Popup>
              </Marker>
            )}
            {endPosition && (
              <Marker position={endPosition}>
                <Popup>
                  Điểm kết thúc: {endPosition.lat}, {endPosition.lng}
                </Popup>
              </Marker>
            )}
            {route.length > 0 && (
              <Polyline positions={route} color="blue" />
            )}
            <MapClickHandler />
          </MapContainer>
        </Col>
      </Row>
    </>
  );
}

export default Bai5;
