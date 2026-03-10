import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import HeaderBar from '../../components/HeaderBar';
import { VPN_SERVERS } from '../../constants/features';
import { BrowserTab, VPNServer } from '../../types';

interface VPNBrowserScreenProps {
  navigation: { goBack: () => void };
}

const VPNBrowserScreen: React.FC<VPNBrowserScreenProps> = ({ navigation }) => {
  const [vpnConnected, setVpnConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState<VPNServer | null>(null);
  const [showServerList, setShowServerList] = useState(false);
  const [browserUrl, setBrowserUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: '1', url: '', title: 'New Tab', isPrivate: true, isLoading: false },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [isPrivateMode, setIsPrivateMode] = useState(true);
  const [showVPNPanel, setShowVPNPanel] = useState(true);
  const [adBlockEnabled, setAdBlockEnabled] = useState(true);
  const [trackingProtection, setTrackingProtection] = useState(true);
  const [httpsOnly, setHttpsOnly] = useState(true);

  const handleConnect = (server: VPNServer) => {
    setSelectedServer(server);
    setVpnConnected(true);
    setShowServerList(false);
    Alert.alert(
      'VPN Connected',
      `Connected to ${server.city}, ${server.country}\nProtocol: ${server.protocol}\nLatency: ${server.latency}ms`
    );
  };

  const handleDisconnect = () => {
    setVpnConnected(false);
    setSelectedServer(null);
  };

  const handleNavigate = () => {
    if (!browserUrl.trim()) return;
    setIsLoading(true);
    let url = browserUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.')) {
        url = 'https://' + url;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    setBrowserUrl(url);

    setTimeout(() => {
      setIsLoading(false);
      setTabs(prev =>
        prev.map(t =>
          t.id === activeTabId
            ? { ...t, url, title: url.replace('https://', '').replace('http://', '').split('/')[0], isLoading: false }
            : t
        )
      );
    }, 1500);
  };

  const addNewTab = () => {
    const newTab: BrowserTab = {
      id: `tab_${Date.now()}`,
      url: '',
      title: 'New Tab',
      isPrivate: isPrivateMode,
      isLoading: false,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setBrowserUrl('');
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="VPN Browser"
        subtitle={vpnConnected ? `Connected - ${selectedServer?.city}` : 'Disconnected'}
        onBack={() => navigation.goBack()}
        rightIcon="shield"
        onRightPress={() => setShowVPNPanel(!showVPNPanel)}
        color={Colors.vpnBrowserColor}
      />

      {/* VPN Status Bar */}
      <View style={[styles.vpnStatusBar, vpnConnected ? styles.vpnConnected : styles.vpnDisconnected]}>
        <View style={styles.vpnStatusContent}>
          <View style={[styles.vpnDot, { backgroundColor: vpnConnected ? Colors.success : Colors.error }]} />
          <Text style={styles.vpnStatusText}>
            {vpnConnected
              ? `VPN Active - ${selectedServer?.country} (${selectedServer?.protocol})`
              : 'VPN Disconnected - Your traffic is not encrypted'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.vpnToggle, vpnConnected ? styles.vpnToggleOff : styles.vpnToggleOn]}
          onPress={vpnConnected ? handleDisconnect : () => setShowServerList(true)}
        >
          <Text style={styles.vpnToggleText}>{vpnConnected ? 'Disconnect' : 'Connect'}</Text>
        </TouchableOpacity>
      </View>

      {/* Browser URL Bar */}
      <View style={styles.urlBar}>
        <TouchableOpacity style={styles.urlIcon}>
          <Feather
            name={isPrivateMode ? 'eye-off' : 'globe'}
            size={18}
            color={isPrivateMode ? Colors.vpnBrowserColor : Colors.textMuted}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.urlInput}
          value={browserUrl}
          onChangeText={setBrowserUrl}
          placeholder="Search or enter URL..."
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={handleNavigate}
        />
        {isLoading ? (
          <TouchableOpacity onPress={() => setIsLoading(false)} style={styles.urlAction}>
            <Feather name="x" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleNavigate} style={styles.urlAction}>
            <Feather name="arrow-right" size={18} color={Colors.vpnBrowserColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.browserTab, activeTabId === tab.id && styles.browserTabActive]}
            onPress={() => {
              setActiveTabId(tab.id);
              setBrowserUrl(tab.url);
            }}
          >
            <Feather
              name={tab.isPrivate ? 'eye-off' : 'globe'}
              size={12}
              color={activeTabId === tab.id ? Colors.vpnBrowserColor : Colors.textMuted}
            />
            <Text style={[styles.browserTabText, activeTabId === tab.id && styles.browserTabTextActive]} numberOfLines={1}>
              {tab.title}
            </Text>
            {tabs.length > 1 && (
              <TouchableOpacity onPress={() => closeTab(tab.id)} style={styles.closeTabBtn}>
                <Feather name="x" size={12} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addTabBtn} onPress={addNewTab}>
          <Feather name="plus" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* VPN Panel */}
        {showVPNPanel && (
          <View style={styles.vpnPanel}>
            <Text style={styles.panelTitle}>VPN Settings</Text>

            {/* Server List */}
            {showServerList && (
              <View style={styles.serverList}>
                <Text style={styles.serverListTitle}>Select Server</Text>
                {VPN_SERVERS.map(server => (
                  <TouchableOpacity
                    key={server.id}
                    style={styles.serverItem}
                    onPress={() => handleConnect(server)}
                  >
                    <Text style={styles.serverFlag}>{server.flag}</Text>
                    <View style={styles.serverInfo}>
                      <Text style={styles.serverCountry}>{server.country}</Text>
                      <Text style={styles.serverCity}>{server.city} - {server.protocol}</Text>
                    </View>
                    <View style={styles.serverLatency}>
                      <View style={[
                        styles.latencyDot,
                        { backgroundColor: server.latency < 50 ? Colors.success : server.latency < 100 ? Colors.warning : Colors.error },
                      ]} />
                      <Text style={styles.latencyText}>{server.latency}ms</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {!showServerList && (
              <>
                {/* Quick Connect */}
                <TouchableOpacity
                  style={styles.quickConnectBtn}
                  onPress={() => setShowServerList(true)}
                >
                  <Feather name="zap" size={20} color={Colors.vpnBrowserColor} />
                  <Text style={styles.quickConnectText}>
                    {vpnConnected ? 'Change Server' : 'Quick Connect'}
                  </Text>
                  <Feather name="chevron-right" size={18} color={Colors.textMuted} />
                </TouchableOpacity>

                {/* Privacy Settings */}
                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>Privacy & Security</Text>

                  <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Feather name="eye-off" size={18} color={Colors.vpnBrowserColor} />
                      <Text style={styles.settingLabel}>Private Mode</Text>
                    </View>
                    <Switch
                      value={isPrivateMode}
                      onValueChange={setIsPrivateMode}
                      trackColor={{ false: Colors.surface, true: Colors.vpnBrowserColor + '50' }}
                      thumbColor={isPrivateMode ? Colors.vpnBrowserColor : Colors.textMuted}
                    />
                  </View>

                  <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Feather name="slash" size={18} color={Colors.vpnBrowserColor} />
                      <Text style={styles.settingLabel}>Ad Blocker</Text>
                    </View>
                    <Switch
                      value={adBlockEnabled}
                      onValueChange={setAdBlockEnabled}
                      trackColor={{ false: Colors.surface, true: Colors.vpnBrowserColor + '50' }}
                      thumbColor={adBlockEnabled ? Colors.vpnBrowserColor : Colors.textMuted}
                    />
                  </View>

                  <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Feather name="shield" size={18} color={Colors.vpnBrowserColor} />
                      <Text style={styles.settingLabel}>Tracking Protection</Text>
                    </View>
                    <Switch
                      value={trackingProtection}
                      onValueChange={setTrackingProtection}
                      trackColor={{ false: Colors.surface, true: Colors.vpnBrowserColor + '50' }}
                      thumbColor={trackingProtection ? Colors.vpnBrowserColor : Colors.textMuted}
                    />
                  </View>

                  <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Feather name="lock" size={18} color={Colors.vpnBrowserColor} />
                      <Text style={styles.settingLabel}>HTTPS Only</Text>
                    </View>
                    <Switch
                      value={httpsOnly}
                      onValueChange={setHttpsOnly}
                      trackColor={{ false: Colors.surface, true: Colors.vpnBrowserColor + '50' }}
                      thumbColor={httpsOnly ? Colors.vpnBrowserColor : Colors.textMuted}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        {/* Browser Content Area */}
        {!showVPNPanel && (
          <View style={styles.browserContent}>
            {browserUrl ? (
              <View style={styles.webViewPlaceholder}>
                {isLoading ? (
                  <View style={styles.loadingView}>
                    <Feather name="loader" size={32} color={Colors.vpnBrowserColor} />
                    <Text style={styles.loadingText}>Loading...</Text>
                  </View>
                ) : (
                  <View style={styles.pageContent}>
                    <Feather name="globe" size={48} color={Colors.vpnBrowserColor} />
                    <Text style={styles.pageTitle}>
                      {tabs.find(t => t.id === activeTabId)?.title || 'Web Page'}
                    </Text>
                    <Text style={styles.pageUrl}>{browserUrl}</Text>
                    <Text style={styles.pageNote}>
                      Web content would render here using WebView in production build.
                      {vpnConnected ? '\n\nTraffic encrypted via VPN' : ''}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.newTabContent}>
                <Feather name="shield" size={64} color={Colors.vpnBrowserColor} />
                <Text style={styles.newTabTitle}>Private Browsing</Text>
                <Text style={styles.newTabSubtitle}>
                  Your browsing activity won't be saved on this device
                </Text>
                <View style={styles.shortcutsGrid}>
                  {[
                    { icon: 'search', label: 'Google', url: 'https://google.com' },
                    { icon: 'twitter', label: 'Twitter', url: 'https://twitter.com' },
                    { icon: 'github', label: 'GitHub', url: 'https://github.com' },
                    { icon: 'book', label: 'Wikipedia', url: 'https://wikipedia.org' },
                  ].map(shortcut => (
                    <TouchableOpacity
                      key={shortcut.label}
                      style={styles.shortcutItem}
                      onPress={() => {
                        setBrowserUrl(shortcut.url);
                        handleNavigate();
                      }}
                    >
                      <View style={styles.shortcutIcon}>
                        <Feather name={shortcut.icon as keyof typeof Feather.glyphMap} size={20} color={Colors.vpnBrowserColor} />
                      </View>
                      <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Browser Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavBtn}>
          <Feather name="arrow-left" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavBtn}>
          <Feather name="arrow-right" size={22} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => setBrowserUrl('')}>
          <Feather name="home" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => setShowVPNPanel(!showVPNPanel)}>
          <Feather name="shield" size={22} color={vpnConnected ? Colors.success : Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavBtn}>
          <View style={styles.tabCount}>
            <Text style={styles.tabCountText}>{tabs.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  vpnStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  vpnConnected: {
    backgroundColor: Colors.success + '15',
  },
  vpnDisconnected: {
    backgroundColor: Colors.error + '15',
  },
  vpnStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vpnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  vpnStatusText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    flex: 1,
  },
  vpnToggle: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  vpnToggleOn: {
    backgroundColor: Colors.vpnBrowserColor,
  },
  vpnToggleOff: {
    backgroundColor: Colors.error + '30',
  },
  vpnToggleText: {
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  urlIcon: {
    marginRight: Spacing.sm,
  },
  urlInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  urlAction: {
    padding: Spacing.xs,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    maxHeight: 36,
  },
  browserTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    marginRight: 4,
    maxWidth: 150,
  },
  browserTabActive: {
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 2,
    borderBottomColor: Colors.vpnBrowserColor,
  },
  browserTabText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginLeft: 4,
    flex: 1,
  },
  browserTabTextActive: {
    color: Colors.textPrimary,
  },
  closeTabBtn: {
    marginLeft: 4,
    padding: 2,
  },
  addTabBtn: {
    padding: 6,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  vpnPanel: {
    padding: Spacing.lg,
  },
  panelTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  serverList: {
    marginBottom: Spacing.xl,
  },
  serverListTitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  serverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  serverFlag: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  serverInfo: {
    flex: 1,
  },
  serverCountry: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  serverCity: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  serverLatency: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  latencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  latencyText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  quickConnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  quickConnectText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    marginLeft: Spacing.md,
  },
  settingsSection: {
    marginBottom: Spacing.xl,
  },
  settingsSectionTitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  browserContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  webViewPlaceholder: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingView: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  pageContent: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  pageTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
  },
  pageUrl: {
    fontSize: FontSizes.sm,
    color: Colors.vpnBrowserColor,
    marginTop: Spacing.sm,
  },
  pageNote: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 20,
  },
  newTabContent: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
  },
  newTabTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.xl,
  },
  newTabSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: Spacing.xxxl,
    gap: Spacing.xl,
  },
  shortcutItem: {
    alignItems: 'center',
    width: 70,
  },
  shortcutIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  shortcutLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingBottom: 30,
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bottomNavBtn: {
    padding: Spacing.sm,
  },
  tabCount: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});

export default VPNBrowserScreen;
