export type Locale = "sv" | "en";

const translations = {
  sv: {
    // App
    "app.title": "PikeHunter 🐟",

    // Nav / Header
    "nav.menu": "Meny",
    "nav.home": "Hem",
    "nav.catches": "Mina fångster",
    "nav.tacklebox": "Beteslåda",
    "nav.locations": "Platser",
    "nav.signOut": "Logga ut",
    "nav.profile": "Profil",

    // Common
    "common.loading": "Laddar...",
    "common.saving": "Sparar...",
    "common.save": "Spara",
    "common.saved": "Sparat!",
    "common.cancel": "Avbryt",
    "common.edit": "Redigera",
    "common.delete": "Radera",
    "common.deleting": "Raderar...",
    "common.confirm": "Bekräfta",
    "common.name": "Namn",
    "common.type": "Typ",
    "common.add": "Lägg till",
    "common.searchPlaceholder": "Sök...",

    // Login
    "login.createAccount": "Skapa konto",
    "login.signIn": "Logga in",
    "login.signUp": "Registrera",
    "login.email": "E-post",
    "login.password": "Lösenord",
    "login.checkEmail": "Kolla din e-post för att bekräfta ditt konto.",
    "login.hasAccount": "Har du redan ett konto?",
    "login.noAccount": "Har du inget konto?",

    // Fish / Catches
    "fish.addTitle": "Lägg till fångst",
    "fish.species": "Art",
    "fish.weight": "Vikt",
    "fish.weightUnit": "Vikt (g)",
    "fish.length": "Längd",
    "fish.lengthUnit": "Längd (cm)",
    "fish.dateCaught": "Fångstdatum",
    "fish.moreDetails": "Mer detaljer",
    "fish.location": "Plats",
    "fish.tackle": "Bete",
    "fish.depthUnit": "Djup (m)",
    "fish.depth": "Djup",
    "fish.weather": "Väder",
    "fish.additionalInfo": "Övrig info",
    "fish.uploadPhoto": "Ladda upp foto",
    "fish.addFish": "Lägg till fångst",
    "fish.adding": "Lägger till...",
    "fish.added": "Fisk tillagd!",
    "fish.unknown": "Okänd",
    "fish.unknownSpecies": "Okänd art",
    "fish.notFound": "Fisk hittades inte.",

    // Catches page
    "catches.title": "Mina fångster",
    "catches.noCatches": "Inga fångster ännu.",
    "catches.clearAll": "Rensa alla",
    "catches.clearTitle": "Rensa alla fångster",
    "catches.clearMessage": "Är du säker på att du vill radera alla dina fångster? Detta kan inte ångras.",
    "catches.deleteAll": "Radera alla",
    "catches.backToCatches": "← Tillbaka till mina fångster",
    "catches.deleteTitle": "Radera fångst",
    "catches.deleteMessage": "Är du säker på att du vill radera denna fångst? Detta kan inte ångras.",
    "catches.count": "Fångster",

    // Profile
    "profile.title": "Min profil",
    "profile.saved": "Profil sparad!",
    "profile.displayName": "Visningsnamn",
    "profile.location": "Plats",
    "profile.bio": "Bio",
    "profile.changePhoto": "Byt foto",
    "profile.saveProfile": "Spara profil",
    "profile.language": "Språk",
    "profile.swedish": "Svenska",
    "profile.english": "English",

    // Locations
    "locations.title": "Platser",
    "locations.noLocations": "Inga platser ännu. Lägg till en fisk med en plats för att se den här.",
    "locations.backToLocations": "← Tillbaka till platser",
    "locations.info": "Platsinformation",
    "locations.noCatches": "Inga fångster på denna plats.",

    // Tacklebox
    "tacklebox.title": "Beteslåda",
    "tacklebox.noTackles": "Inga beten ännu.",
    "tacklebox.addTackle": "Lägg till bete",
    "tacklebox.colour": "Färg",
    "tacklebox.adding": "Lägger till...",
    "tacklebox.backToTacklebox": "← Tillbaka till beteslådan",
    "tacklebox.info": "Betesinformation",
    "tacklebox.noCatches": "Inga fångster med detta bete.",
  },
  en: {
    // App
    "app.title": "PikeHunter 🐟",

    // Nav / Header
    "nav.menu": "Menu",
    "nav.home": "Home",
    "nav.catches": "My Catches",
    "nav.tacklebox": "Tacklebox",
    "nav.locations": "Locations",
    "nav.signOut": "Sign Out",
    "nav.profile": "Profile",

    // Common
    "common.loading": "Loading...",
    "common.saving": "Saving...",
    "common.save": "Save",
    "common.saved": "Saved!",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.deleting": "Deleting...",
    "common.confirm": "Confirm",
    "common.name": "Name",
    "common.type": "Type",
    "common.add": "Add",
    "common.searchPlaceholder": "Type to search...",

    // Login
    "login.createAccount": "Create Account",
    "login.signIn": "Sign In",
    "login.signUp": "Sign Up",
    "login.email": "Email",
    "login.password": "Password",
    "login.checkEmail": "Check your email to confirm your account.",
    "login.hasAccount": "Already have an account?",
    "login.noAccount": "Don't have an account?",

    // Fish / Catches
    "fish.addTitle": "Add a catch",
    "fish.species": "Species",
    "fish.weight": "Weight",
    "fish.weightUnit": "Weight (g)",
    "fish.length": "Length",
    "fish.lengthUnit": "Length (cm)",
    "fish.dateCaught": "Date Caught",
    "fish.moreDetails": "More details",
    "fish.location": "Location",
    "fish.tackle": "Tackle",
    "fish.depthUnit": "Depth (m)",
    "fish.depth": "Depth",
    "fish.weather": "Weather",
    "fish.additionalInfo": "Additional Info",
    "fish.uploadPhoto": "Upload photo",
    "fish.addFish": "Add Catch",
    "fish.adding": "Adding...",
    "fish.added": "Fish added!",
    "fish.unknown": "Unknown",
    "fish.unknownSpecies": "Unknown species",
    "fish.notFound": "Fish not found.",

    // Catches page
    "catches.title": "My Catches",
    "catches.noCatches": "No catches yet.",
    "catches.clearAll": "Clear All",
    "catches.clearTitle": "Clear all catches",
    "catches.clearMessage": "Are you sure you want to delete all your catches? This cannot be undone.",
    "catches.deleteAll": "Delete All",
    "catches.backToCatches": "← Back to My Catches",
    "catches.deleteTitle": "Delete catch",
    "catches.deleteMessage": "Are you sure you want to delete this catch? This cannot be undone.",
    "catches.count": "Catches",

    // Profile
    "profile.title": "My Profile",
    "profile.saved": "Profile saved!",
    "profile.displayName": "Display Name",
    "profile.location": "Location",
    "profile.bio": "Bio",
    "profile.changePhoto": "Change photo",
    "profile.saveProfile": "Save Profile",
    "profile.language": "Language",
    "profile.swedish": "Svenska",
    "profile.english": "English",

    // Locations
    "locations.title": "Locations",
    "locations.noLocations": "No locations yet. Add a fish with a location to see it here.",
    "locations.backToLocations": "← Back to Locations",
    "locations.info": "Location Info",
    "locations.noCatches": "No catches at this location.",

    // Tacklebox
    "tacklebox.title": "Tacklebox",
    "tacklebox.noTackles": "No tackles yet.",
    "tacklebox.addTackle": "Add Tackle",
    "tacklebox.colour": "Colour",
    "tacklebox.adding": "Adding...",
    "tacklebox.backToTacklebox": "← Back to Tacklebox",
    "tacklebox.info": "Tackle Info",
    "tacklebox.noCatches": "No catches with this tackle.",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["sv"];

export function getTranslations(locale: Locale) {
  return translations[locale];
}
