import { useEffect, useState } from 'react';
import IconPicker from '../../IconPicker';
import { API_URL } from '../constants';
import type { Profile } from '../types';

interface ProfileEditorProps {
  profile: Profile | null;
  onSave: (profile: Profile) => void;
}

const EMPTY_PROFILE: Profile = {
  name: '',
  title: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  avatarUrl: '',
  cvUrl: '',
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    githubIcon: '',
    linkedinIcon: '',
    twitterIcon: '',
    websiteIcon: '',
  },
  techStack: [],
};

const ProfileEditor = ({ profile, onSave }: ProfileEditorProps) => {
  const [formData, setFormData] = useState<Profile>(profile || EMPTY_PROFILE);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (profile) {
      const normalizedProfile: Profile = {
        ...profile,
        techStack:
          profile.techStack?.map((tech) => {
            if (typeof tech === 'string') {
              return { name: tech, icon: 'faCode' };
            }
            return tech;
          }) || [],
        socialLinks: {
          github: profile.socialLinks?.github || '',
          linkedin: profile.socialLinks?.linkedin || '',
          twitter: profile.socialLinks?.twitter || '',
          website: profile.socialLinks?.website || '',
          githubIcon: profile.socialLinks?.githubIcon || '',
          linkedinIcon: profile.socialLinks?.linkedinIcon || '',
          twitterIcon: profile.socialLinks?.twitterIcon || '',
          websiteIcon: profile.socialLinks?.websiteIcon || '',
        },
      };
      setFormData(normalizedProfile);
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece resim dosyası yükleyin!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır!");
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    setUploadingAvatar(true);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, avatarUrl: data.url });
      } else {
        alert(`Avatar yükleme başarısız: ${data.message}`);
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      alert('Avatar yüklenirken hata oluştu');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Lütfen sadece PDF dosyası yükleyin!');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    setUploadingCV(true);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, cvUrl: data.url });
      } else {
        alert(`CV yükleme başarısız: ${data.message}`);
      }
    } catch (err) {
      console.error('CV upload error:', err);
      alert('CV yüklenirken hata oluştu');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onSave(formData);
    if (!result) {
      alert('Profil kaydedilemedi!');
    }
  };

  const addTech = () => {
    const name = prompt('Teknoloji adı:');
    if (name) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, { name, icon: 'faCode' }],
      });
    }
  };

  const removeTech = (index: number) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((_, i) => i !== index),
    });
  };

  const updateTechIcon = (index: number, icon: string) => {
    const updated = [...formData.techStack];
    updated[index] = { ...updated[index], icon };
    setFormData({ ...formData, techStack: updated });
  };

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <h2>Profil Bilgileri</h2>

      <div className="form-group">
        <label>İsim</label>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Ünvan</label>
        <input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Biyografi</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefon</label>
          <input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Konum</label>
        <input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Avatar (Profil Fotoğrafı)</label>
          <div className="file-upload-section">
            <div className="upload-options">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
                id="avatar-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="avatar-upload" className="upload-button">
                {uploadingAvatar ? (
                  <>Yükleniyor...</>
                ) : (
                  <>Resim Yükle</>
                )}
              </label>
              <span className="upload-divider">veya</span>
              <input
                type="url"
                placeholder="Avatar URL girin"
                value={formData.avatarUrl || ''}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="url-input avatar-url-input"
              />
            </div>
            {formData.avatarUrl && (
              <div className="file-preview avatar-preview">
                <img
                  src={
                    formData.avatarUrl.startsWith('http')
                      ? formData.avatarUrl
                      : `${window.location.origin}${formData.avatarUrl}`
                  }
                  alt="Avatar Preview"
                  className="avatar-preview-img"
                />
                <div className="preview-actions">
                  <a
                    href={formData.avatarUrl.startsWith('http') ? formData.avatarUrl : `${window.location.origin}${formData.avatarUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-file-btn"
                  >
                    Görüntüle
                  </a>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                    className="remove-file-btn"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>CV Dosyası veya Link</label>
          <div className="file-upload-section">
            <div className="upload-options">
              <input
                type="file"
                accept=".pdf"
                onChange={handleCVUpload}
                disabled={uploadingCV}
                id="cv-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="cv-upload" className="upload-button">
                {uploadingCV ? (
                  <>Yükleniyor...</>
                ) : (
                  <>PDF Yükle</>
                )}
              </label>
              <span className="upload-divider">veya</span>
              <input
                type="url"
                placeholder="CV linki girin (örn: https://...)"
                value={formData.cvUrl || ''}
                onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                className="url-input cv-url-input"
              />
            </div>
            {formData.cvUrl && (
              <div className="file-preview">
                <a href={formData.cvUrl} target="_blank" rel="noopener noreferrer" className="view-file-btn">
                  {formData.cvUrl.includes('http') ? 'Linki Aç' : 'PDF Görüntüle'}
                </a>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cvUrl: '' })}
                  className="remove-file-btn"
                >
                  Kaldır
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3>Sosyal Medya</h3>
      <div className="form-row">
        <div className="form-group">
          <label>GitHub</label>
          <input
            type="url"
            placeholder="https://github.com/kullaniciadi"
            value={formData.socialLinks.github}
            onChange={(e) =>
              setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, github: e.target.value },
              })
            }
          />
          {formData.socialLinks.github && (
            <IconPicker
              value={formData.socialLinks.githubIcon || 'faGithub'}
              onChange={(icon) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, githubIcon: icon },
                })
              }
              label="GitHub Icon Override"
            />
          )}
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/kullaniciadi"
            value={formData.socialLinks.linkedin}
            onChange={(e) =>
              setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
              })
            }
          />
          {formData.socialLinks.linkedin && (
            <IconPicker
              value={formData.socialLinks.linkedinIcon || 'faLinkedin'}
              onChange={(icon) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedinIcon: icon },
                })
              }
              label="LinkedIn Icon Override"
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Twitter</label>
          <input
            type="url"
            placeholder="https://twitter.com/kullaniciadi"
            value={formData.socialLinks.twitter}
            onChange={(e) =>
              setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, twitter: e.target.value },
              })
            }
          />
          {formData.socialLinks.twitter && (
            <IconPicker
              value={formData.socialLinks.twitterIcon || 'faTwitter'}
              onChange={(icon) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, twitterIcon: icon },
                })
              }
              label="Twitter Icon Override"
            />
          )}
        </div>

        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            placeholder="https://websiteadi.com"
            value={formData.socialLinks.website}
            onChange={(e) =>
              setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, website: e.target.value },
              })
            }
          />
          {formData.socialLinks.website && (
            <IconPicker
              value={formData.socialLinks.websiteIcon || 'faGlobe'}
              onChange={(icon) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, websiteIcon: icon },
                })
              }
              label="Website Icon Override"
            />
          )}
        </div>
      </div>

      <h3>Beceriler</h3>
      <div className="form-group">
        <label>Tech Stack</label>
        <div className="tech-stack-list">
          {formData.techStack.map((tech, index) => (
            <div key={index} className="tech-stack-item">
              <div className="tech-stack-item-header">
                <span>{tech.name}</span>
                <button type="button" onClick={() => removeTech(index)} className="remove-tech">
                  x
                </button>
              </div>
              <IconPicker value={tech.icon || 'faCode'} onChange={(icon) => updateTechIcon(index, icon)} label="Icon" />
            </div>
          ))}
        </div>
        <button type="button" onClick={addTech} className="add-tech-btn">
          Yeni Teknoloji Ekle
        </button>
      </div>

      <button type="submit" className="save-btn">
        Kaydet
      </button>
    </form>
  );
};

export default ProfileEditor;
