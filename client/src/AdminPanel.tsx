import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './AdminPanel.css';
import ProfileEditor from './admin/components/ProfileEditor';
import ProjectsManager from './admin/components/ProjectsManager';
import ServicesManager from './admin/components/ServicesManager';
import { useAdminData } from './admin/hooks/useAdminData';
import type { AdminTab, NotificationState, Project, Service } from './admin/types';
import { FeedbackCard } from './components/common/FeedbackCard';
import { useLanguage } from './i18n/LanguageContext';
import { LanguageToggle } from './components/common/LanguageToggle';
import { DynamicText } from './components/common/DynamicText';

export const AdminPanel = () => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = useCallback((message: string, type: NotificationState['type']) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const {
    projects,
    githubProjects,
    services,
    profile,
    saveProject,
    deleteProject,
    saveService,
    deleteService,
    saveProfile,
  } = useAdminData({ isAuthenticated, onNotify: showNotification });

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'authenticated');
      showNotification('Giriş başarılı!', 'success');
      return;
    }

    showNotification('Hatalı şifre!', 'error');
    setPassword('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    showNotification('Çıkış yapıldı', 'success');
  };

  const handleSaveProject = async (project: Project) => {
    const isSaved = await saveProject(project);
    if (isSaved) {
      setEditingProject(null);
    }

    return isSaved;
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;

    await deleteProject(id);
  };

  const handleSaveService = async (service: Service) => {
    const isSaved = await saveService(service);
    if (isSaved) {
      setEditingService(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Bu servisi silmek istediğinizden emin misiniz?')) return;

    await deleteService(id);
  };

  const handleSaveProfile = saveProfile;

  const notificationTone = notification?.type === 'success' ? 'success' : 'error';

  const notificationElement = (
    <AnimatePresence>
      {notification ? (
        <motion.div
          key={`${notification.type}-${notification.message}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="admin-feedback-toast"
        >
          <FeedbackCard
            tone={notificationTone}
            title={notification.type === 'success' ? t('feedback.success') : t('feedback.error')}
            message={<DynamicText text={notification.message} fallback={notification.message} />}
            className="shadow-lg"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        {notificationElement}

        <div className="login-container">
          <div className="login-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <h1 style={{ marginBottom: 0 }}>{t('admin.login.title')}</h1>
              <LanguageToggle />
            </div>
            <p>{t('admin.login.desc')}</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder={t('admin.login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                autoFocus
              />
              <button type="submit" className="login-button">
                {t('admin.login.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {notificationElement}

      <div className="admin-header">
        <div className="header-content">
          <h1>{t('admin.header.title')}</h1>
          <div className="header-buttons">
            <LanguageToggle />
            <button onClick={() => (window.location.href = '/')} className="home-button">
              {t('admin.header.home')}
            </button>
            <button onClick={handleLogout} className="logout-button">
              {t('admin.header.logout')}
            </button>
          </div>
        </div>
        <div className="admin-tabs">
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            {t('admin.tabs.profile')}
          </button>
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
            {t('admin.tabs.projects')} ({projects.length})
          </button>
          <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>
            {t('admin.tabs.services')} ({services.length})
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'profile' && <ProfileEditor profile={profile} onSave={handleSaveProfile} />}

        {activeTab === 'projects' && (
          <ProjectsManager
            projects={projects}
            githubProjects={githubProjects}
            editingProject={editingProject}
            onEdit={setEditingProject}
            onSave={handleSaveProject}
            onDelete={handleDeleteProject}
          />
        )}

        {activeTab === 'services' && (
          <ServicesManager
            services={services}
            editingService={editingService}
            onEdit={setEditingService}
            onSave={handleSaveService}
            onDelete={handleDeleteService}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
