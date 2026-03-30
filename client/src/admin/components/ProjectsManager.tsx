import { useCallback, useEffect, useMemo, useState } from 'react';
import IconPicker from '../../IconPicker';
import { API_URL } from '../constants';
import type { GithubRepository, Project } from '../types';

interface ProjectsManagerProps {
  projects: Project[];
  githubProjects: GithubRepository[];
  editingProject: Project | null;
  onEdit: (project: Project | null) => void;
  onSave: (project: Project) => Promise<boolean>;
  onDelete: (id: string) => Promise<void> | void;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const EMPTY_PROJECT: Project = {
  _id: '',
  title: '',
  description: '',
  tags: [],
  category: 'web',
  categoryIcon: 'faCode',
  icon: 'faLaptopCode',
  link: '',
  githubUrl: '',
  imageUrl: '',
  order: 0,
  isActive: true,
};

const normalizeIdentity = (value: string) => value.trim().toLowerCase();

const getProjectCategoryLabel = (category: Project['category']) => {
  if (category === 'web') return 'Web';
  if (category === 'game') return 'Game';
  return 'Tools';
};

const createProjectIdentitySet = (projectList: Project[]) => {
  const identitySet = new Set<string>();

  projectList.forEach((project) => {
    if (project.githubUrl) {
      identitySet.add(`url:${normalizeIdentity(project.githubUrl)}`);
    }
    if (project.title) {
      identitySet.add(`title:${normalizeIdentity(project.title)}`);
    }
  });

  return identitySet;
};

const isRepoAlreadyImported = (repo: GithubRepository, existingIdentitySet: Set<string>) =>
  existingIdentitySet.has(`url:${normalizeIdentity(repo.html_url)}`) ||
  existingIdentitySet.has(`title:${normalizeIdentity(repo.name)}`);

const buildProjectFromRepo = (repo: GithubRepository): Project => {
  const topics = Array.isArray(repo.topics) ? repo.topics : [];

  return {
    title: repo.name,
    description: repo.description || '',
    tags: topics.length > 0 ? topics : repo.language ? [repo.language] : [],
    category: topics.includes('game') ? 'game' : topics.includes('tool') ? 'tools' : 'web',
    link: repo.homepage || repo.html_url,
    githubUrl: repo.html_url,
    imageUrl: `https://opengraph.githubassets.com/1/Timujaponya/${repo.name}`,
    order: 0,
    isActive: true,
  };
};

const renderProjectTags = (tags: string[]) => {
  if (tags.length === 0) return null;

  return (
    <div className="tags-preview">
      {tags.slice(0, 3).map((tag, idx) => (
        <span key={`${tag}-${idx}`} className="tag-mini">
          {tag}
        </span>
      ))}
      {tags.length > 3 && <span className="tag-mini">+{tags.length - 3}</span>}
    </div>
  );
};

const ProjectsManager = ({ projects, githubProjects, editingProject, onEdit, onSave, onDelete }: ProjectsManagerProps) => {
  const safeProjects = useMemo(() => (Array.isArray(projects) ? projects : []), [projects]);
  const safeGithubProjects = useMemo(() => (Array.isArray(githubProjects) ? githubProjects : []), [githubProjects]);
  const existingProjectIdentitySet = useMemo(() => createProjectIdentitySet(safeProjects), [safeProjects]);

  const githubImportRows = useMemo(
    () =>
      safeGithubProjects.map((repo) => ({
        repo,
        existsInDb: isRepoAlreadyImported(repo, existingProjectIdentitySet),
      })),
    [safeGithubProjects, existingProjectIdentitySet],
  );

  const [formData, setFormData] = useState<Project>(EMPTY_PROJECT);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [importingRepoId, setImportingRepoId] = useState<number | null>(null);

  useEffect(() => {
    if (!editingProject) return;

    setFormData({
      ...editingProject,
      tags: editingProject.tags || [],
    });
  }, [editingProject]);

  const resetForm = useCallback(() => {
    setFormData(EMPTY_PROJECT);
    setTagInput('');
    onEdit(null);
  }, [onEdit]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır!");
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Sadece resim dosyaları yüklenebilir!');
      return;
    }

    setUploading(true);
    const payload = new FormData();
    payload.append('file', file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: payload,
      });

      if (!res.ok) {
        alert('Resim yükleme başarısız oldu');
        return;
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Bir hata oluştu');
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.title.trim()) {
        alert('Başlık zorunludur!');
        return;
      }

      const isSaved = await onSave(formData);
      if (isSaved) {
        resetForm();
      }
    },
    [formData, onSave, resetForm],
  );

  const addTag = useCallback(() => {
    const normalizedTag = tagInput.trim();
    if (!normalizedTag) return;

    setFormData((prev) => {
      if (prev.tags.includes(normalizedTag)) {
        return prev;
      }

      return { ...prev, tags: [...prev.tags, normalizedTag] };
    });

    setTagInput('');
  }, [tagInput]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const importGithubProject = useCallback(
    async (repo: GithubRepository) => {
      if (isRepoAlreadyImported(repo, existingProjectIdentitySet)) {
        alert(`"${repo.name}" projesi zaten veritabanında mevcut!`);
        return;
      }

      if (!confirm(`"${repo.name}" projesini veritabanına eklemek istediğinizden emin misiniz?`)) {
        return;
      }

      setImportingRepoId(repo.id);
      try {
        const isSaved = await onSave(buildProjectFromRepo(repo));
        if (isSaved) {
          resetForm();
        }
      } finally {
        setImportingRepoId(null);
      }
    },
    [existingProjectIdentitySet, onSave, resetForm],
  );

  const handleDeleteProject = useCallback(
    (id?: string) => {
      if (!id) return;
      void onDelete(id);
    },
    [onDelete],
  );

  const hasProjects = safeProjects.length > 0;
  const hasGithubProjects = safeGithubProjects.length > 0;

  return (
    <div className="manager-container">
      <div className="items-list">
        <div className="list-header">
          <h2>Projeler ({safeProjects.length})</h2>
          <button onClick={resetForm} className="new-item-btn">
            Yeni Proje
          </button>
        </div>

        {!hasProjects ? (
          <div className="empty-state">
            <p>Henüz proje eklenmemiş</p>
            <p className="empty-state-hint">Sağdaki formu kullanarak yeni proje ekleyebilirsiniz</p>
          </div>
        ) : (
          safeProjects.map((project) => (
            <div key={project._id || project.title} className="item-card">
              <div className="item-card-header">
                <h3>{project.title}</h3>
                <span className={`status-badge ${project.isActive ? 'active' : 'inactive'}`}>
                  {project.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <p className="item-description">{project.description || 'Açıklama yok'}</p>

              <div className="item-meta">
                <span className={`category-badge category-${project.category}`}>{getProjectCategoryLabel(project.category)}</span>
                {renderProjectTags(project.tags || [])}
              </div>

              <div className="item-actions">
                <button onClick={() => onEdit(project)} className="edit-btn">
                  Düzenle
                </button>
                <button onClick={() => handleDeleteProject(project._id)} className="delete-btn" disabled={!project._id}>
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="editor-panel">
        <h2>{editingProject ? 'Proje Düzenle' : 'Yeni Proje Ekle'}</h2>
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label>Başlık *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Proje adı"
              required
            />
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Proje hakkında kısa açıklama"
            />
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as Project['category'] }))}
            >
              <option value="web">Web</option>
              <option value="game">Game</option>
              <option value="tools">Tools</option>
            </select>
          </div>

          <IconPicker
            value={formData.icon || 'faLaptopCode'}
            onChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
            label="Proje İkonu (Opsiyonel)"
          />

          <IconPicker
            value={formData.categoryIcon || 'faCode'}
            onChange={(categoryIcon) => setFormData((prev) => ({ ...prev, categoryIcon }))}
            label="Kategori İkonu (Opsiyonel)"
          />

          <div className="form-group">
            <label>Etiketler (Tags)</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Etiket ekle (Enter ile)"
              />
              <button type="button" onClick={addTag} className="add-tag-inline-btn">
                Ekle
              </button>
            </div>
            <div className="tech-stack-editor">
              {formData.tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="tech-item">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Proje Linki</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label>GitHub URL</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="form-group">
            <label>Proje Görseli</label>
            <div className="image-upload-section">
              <div className="upload-options">
                <div className="upload-option">
                  <label className="upload-btn">
                    {uploading ? 'Yükleniyor...' : 'Resim Yükle'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className="upload-hint">veya</span>
                </div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Görsel URL'si girin"
                  className="url-input"
                />
              </div>
            </div>
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={formData.imageUrl} alt="Preview" />
                <button type="button" onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))} className="remove-image-btn">
                  Görseli Kaldır
                </button>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sıra (Küçük önce görünür)</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
                min="0"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                <span>Aktif (Ana sayfada göster)</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingProject ? 'Güncelle' : 'Ekle'}
            </button>
            {editingProject && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                İptal
              </button>
            )}
          </div>
        </form>

        {!editingProject && !hasGithubProjects && (
          <div className="info-box">
            <p>
              <strong>GitHub Entegrasyonu:</strong> GitHub projeleriniz yüklenirken sorun oluştu veya hiç public repo yok.
            </p>
            <p>
              Token kontrolü için:{' '}
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                GitHub Settings → Tokens
              </a>
            </p>
          </div>
        )}

        {!editingProject && hasGithubProjects && (
          <div className="github-import-section">
            <h3>GitHub Projelerini İçe Aktar</h3>
            <p className="import-hint">Aşağıdaki GitHub projelerinizi veritabanına ekleyerek düzenleyebilirsiniz</p>
            <div className="github-projects-grid">
              {githubImportRows.map(({ repo, existsInDb }) => (
                <div key={repo.id} className={`github-project-card ${existsInDb ? 'already-imported' : ''}`}>
                  <div className="github-card-header">
                    <h4>{repo.name}</h4>
                    {repo.stargazers_count > 0 && <span className="stars">⭐ {repo.stargazers_count}</span>}
                  </div>
                  <p className="github-description">{repo.description || 'Açıklama yok'}</p>
                  {repo.language && <span className="language-badge">{repo.language}</span>}
                  {existsInDb ? (
                    <button className="import-btn already-added" disabled>
                      Zaten Eklendi
                    </button>
                  ) : (
                    <button
                      onClick={() => importGithubProject(repo)}
                      className="import-btn"
                      disabled={importingRepoId === repo.id}
                    >
                      {importingRepoId === repo.id ? 'Ekleniyor...' : 'Veritabanına Ekle'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;
