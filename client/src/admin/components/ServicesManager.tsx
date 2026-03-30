import { useEffect, useState } from 'react';
import IconPicker from '../../IconPicker';
import type { Service } from '../types';

interface ServicesManagerProps {
  services: Service[];
  editingService: Service | null;
  onEdit: (service: Service | null) => void;
  onSave: (service: Service) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

const EMPTY_SERVICE: Service = {
  title: '',
  description: '',
  icon: 'faLaptopCode',
  price: { min: 0, max: 0, currency: 'USD' },
  features: [],
  order: 0,
  isActive: true,
};

const ServicesManager = ({ services, editingService, onEdit, onSave, onDelete }: ServicesManagerProps) => {
  const [formData, setFormData] = useState<Service>(EMPTY_SERVICE);

  useEffect(() => {
    if (editingService) {
      setFormData(editingService);
    }
  }, [editingService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData(EMPTY_SERVICE);
    onEdit(null);
  };

  const addFeature = () => {
    const text = prompt('Özellik:');
    if (text) {
      setFormData({
        ...formData,
        features: [...formData.features, { text, icon: 'faCheck' }],
      });
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeatureIcon = (index: number, icon: string) => {
    const updated = [...formData.features];
    updated[index] = { ...updated[index], icon };
    setFormData({ ...formData, features: updated });
  };

  return (
    <div className="manager-container">
      <div className="items-list">
        <div className="list-header">
          <h2>Servisler ({services.length})</h2>
          <button onClick={resetForm} className="new-item-btn">
            Yeni Servis
          </button>
        </div>

        {services.length === 0 ? (
          <div className="empty-state">
            <p>Henüz servis eklenmemiş</p>
            <p className="empty-state-hint">Sağdaki formu kullanarak yeni servis ekleyebilirsiniz</p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service._id || service.title} className="item-card">
              <div className="item-card-header">
                <div className="service-header-content">
                  <div className="service-icon-large">{service.icon}</div>
                  <h3>{service.title}</h3>
                </div>
                <span className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                  {service.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <p className="item-description">{service.description}</p>
              <p className="price">
                {service.price.min} - {service.price.max} {service.price.currency}
              </p>
              {service.features && service.features.length > 0 && (
                <div className="service-features-preview">
                  <span className="features-count">{service.features.length} özellik</span>
                </div>
              )}
              <div className="item-actions">
                <button onClick={() => onEdit(service)} className="edit-btn">
                  Düzenle
                </button>
                <button onClick={() => service._id && onDelete(service._id)} className="delete-btn" disabled={!service._id}>
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="editor-panel">
        <h2>{editingService ? 'Servis Düzenle' : 'Yeni Servis Ekle'}</h2>
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label>Başlık</label>
            <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <IconPicker value={formData.icon} onChange={(icon) => setFormData({ ...formData, icon })} label="Servis İkonu" />

          <h4>Fiyat</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Min</label>
              <input
                type="number"
                value={formData.price.min}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: { ...formData.price, min: parseInt(e.target.value, 10) || 0 },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Max</label>
              <input
                type="number"
                value={formData.price.max}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: { ...formData.price, max: parseInt(e.target.value, 10) || 0 },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Para Birimi</label>
              <select
                value={formData.price.currency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: { ...formData.price, currency: e.target.value },
                  })
                }
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="TRY">TRY</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Özellikler</label>
            <div className="features-list">
              {formData.features.map((feature, index) => (
                <div key={index} className="feature-item-editor">
                  <div className="feature-item-header">
                    <span>{feature.text}</span>
                    <button type="button" onClick={() => removeFeature(index)} className="remove-feature">
                      x
                    </button>
                  </div>
                  <IconPicker value={feature.icon || 'faCheck'} onChange={(icon) => updateFeatureIcon(index, icon)} label="Icon" />
                </div>
              ))}
            </div>
            <button type="button" onClick={addFeature} className="add-tech-btn">
              Yeni Özellik Ekle
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sıra (Küçük önce görünür)</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                min="0"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span>Aktif (Ana sayfada göster)</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingService ? 'Güncelle' : 'Ekle'}
            </button>
            {editingService && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                İptal
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesManager;
