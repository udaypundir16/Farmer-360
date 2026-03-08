# Translation Guide

## ✅ Completed

### Translation Files Created
- ✅ **English** (`en/translation.json`) - Complete with all UI strings
- ✅ **Hindi** (`hi/translation.json`) - Complete Hindi translations
- ✅ **Tamil** (`ta/translation.json`) - Complete Tamil translations

### Components Updated with Translations
- ✅ **Navbar** - Menu items and buttons translated
- ✅ **Dashboard** - All text translated (welcome message, widgets, features)
- ✅ **Markets** - Page title, statistics, filters translated

### Translation Structure
All translations are organized into logical sections:
- `common` - Common UI elements (buttons, labels, etc.)
- `auth` - Authentication pages (login, register)
- `dashboard` - Dashboard page content
- `markets` - Market prices page
- `schemes` - Government schemes page
- `ai_chat` - AI chat assistant
- `alerts` - Price alerts page
- `profile` - User profile page
- `footer` - Footer content

## 🔄 How to Use Translations

### In Components

1. **Import useTranslation hook:**
```jsx
import { useTranslation } from 'react-i18next';
```

2. **Get translation function:**
```jsx
const { t } = useTranslation();
```

3. **Use translations:**
```jsx
// Simple translation
<h1>{t('common.dashboard')}</h1>

// Translation with variables
<p>{t('dashboard.welcome_farmer', { name: user?.fullName })}</p>

// Nested translations
<button>{t('common.save')}</button>
```

### Translation Keys Format

- Use dot notation: `section.key`
- Example: `common.dashboard`, `auth.welcome_back`
- For nested objects: `ai_chat.quick_actions.weather`

## 📝 Remaining Components to Update

To complete full translation support, update these components:

### High Priority
1. **Login.jsx** - Use `auth.*` keys
2. **Register.jsx** - Use `auth.*` keys
3. **Schemes.jsx** - Use `schemes.*` keys
4. **AIChat.jsx** - Use `ai_chat.*` keys
5. **Alerts.jsx** - Use `alerts.*` keys
6. **Profile.jsx** - Use `profile.*` keys

### Medium Priority
7. **PriceCard.jsx** - Use `markets.*` keys for Min/Max/Current
8. **SchemeCard.jsx** - Use `schemes.*` keys
9. **CreateAlert.jsx** - Use `alerts.*` keys
10. **WeatherWidget.jsx** - Use `dashboard.*` keys
11. **PriceSummary.jsx** - Use `markets.*` keys
12. **ActiveAlerts.jsx** - Use `alerts.*` keys
13. **RecommendedSchemes.jsx** - Use `schemes.*` keys

### Example Update Pattern

**Before:**
```jsx
<h1>Market Prices</h1>
<p>No prices found</p>
```

**After:**
```jsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

<h1>{t('markets.title')}</h1>
<p>{t('markets.no_prices_found')}</p>
```

## 🌍 Language Switching

The language selector is already implemented in:
- `components/layout/LanguageSelector.jsx`
- `components/ui/LanguageSelector.jsx`

Users can switch languages using the dropdown in the navbar. The selected language is:
- Saved in browser localStorage
- Persisted across page reloads
- Applied to all translated components

## 📋 Translation Keys Reference

### Common Keys (`common.*`)
- `welcome`, `dashboard`, `market_prices`, `schemes`, `ai_chat`, `alerts`
- `profile`, `logout`, `login`, `register`, `search`, `home`
- `loading`, `error`, `success`, `cancel`, `save`, `delete`
- `edit`, `create`, `update`, `submit`, `close`, `back`
- `next`, `previous`, `view_details`, `no_data`, `try_again`, `at`

### Auth Keys (`auth.*`)
- `welcome_back`, `sign_in`, `create_account`
- `full_name`, `phone`, `mobile_number`, `password`
- `enter_phone`, `enter_password`, `enter_name`
- `password_required`, `phone_required`, `name_required`
- `invalid_phone`, `password_min`, `name_min`
- `login_failed`, `registration_failed`
- `password_strength`, `weak`, `fair`, `good`, `strong`
- `terms_of_service`, `by_signing`, `by_creating`

### Dashboard Keys (`dashboard.*`)
- `welcome_farmer`, `today_prices`, `active_alerts`
- `recommended_schemes`, `weather_in`, `your_area`
- `no_prices`, `no_alerts`, `no_schemes`
- `loading_weather`, `weather_unavailable`, `location_not_available`
- `get_started`, `sign_up`
- `smart_agri_title`, `smart_agri_subtitle`
- `feature_market_prices`, `feature_market_desc`
- `feature_schemes`, `feature_schemes_desc`
- `feature_ai`, `feature_ai_desc`

### Markets Keys (`markets.*`)
- `title`, `subtitle`, `total_commodities`
- `price_increase`, `price_decrease`
- `no_prices_found`, `try_adjusting_filters`
- `price_trend`, `min`, `max`, `current`, `up`, `down`, `at`

### Schemes Keys (`schemes.*`)
- `title`, `subtitle`, `filters`
- `search_placeholder`, `no_schemes_found`
- `try_adjusting_search`, `page`, `of`
- `apply`, `view_details`, `category`, `state`
- `benefits`, `eligibility`, `application_status`
- `pending`, `approved`, `rejected`

### AI Chat Keys (`ai_chat.*`)
- `title`, `subtitle`, `welcome_message`
- `placeholder`, `send`, `error_message`, `typing`
- `quick_actions.weather`, `quick_actions.wheat_prices`
- `quick_actions.pest_control`, `quick_actions.pm_kisan`

### Alerts Keys (`alerts.*`)
- `title`, `subtitle`, `create_alert`
- `create_first_alert`, `no_alerts_yet`
- `create_first_alert_desc`, `active_alerts`, `triggered`
- `commodity`, `market`, `target_price`
- `alert_type`, `above`, `below`
- `create_price_alert`, `market_optional`

### Profile Keys (`profile.*`)
- `title`, `password`, `notifications`, `applications`, `history`
- `edit_profile`, `change_password`
- `notification_settings`, `application_history`, `alert_history`
- `old_password`, `new_password`, `confirm_password`
- `password_mismatch`, `password_changed`, `profile_updated`
- `village`, `district`, `state`, `crops_grown`
- `language_preference`, `sms_notifications`
- `whatsapp_notifications`, `email_notifications`
- `push_notifications`, `save_changes`

## 🚀 Quick Start

1. **Add translation hook to component:**
```jsx
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
```

2. **Replace hardcoded text:**
```jsx
// Before
<h1>Market Prices</h1>

// After
<h1>{t('markets.title')}</h1>
```

3. **Test language switching:**
- Use the language selector in navbar
- Verify all text changes
- Check for any missing translations

## 📝 Notes

- All translation files follow the same structure
- Use consistent key naming (lowercase with underscores)
- Group related translations together
- Use interpolation for dynamic content: `{{variable}}`
- Test translations in all three languages

---

**Status**: Translation files complete. Components are being updated progressively.
