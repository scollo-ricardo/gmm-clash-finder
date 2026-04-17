// ─── FESTIVAL DATA ───────────────────────────────────────────────────────────
// Each festival has: id, name, short, dates, stages (with colors), days, and schedule data.

const FESTIVALS = {

  "graspop-2026": {
    id: "graspop-2026",
    name: "Graspop Metal Meeting 2026",
    short: "GRASPOP 2026",
    location: "Dessel, Belgium",
    dates: "18–21 June 2026",
    updated: { lineup: "17 Apr 2026", prices: "17 Apr 2026" },
    stages: {
      "South Stage":   {color:"#b8a9f0", bg:"rgba(184,169,240,0.18)"},
      "North Stage":   {color:"#7ec8e3", bg:"rgba(126,200,227,0.18)"},
      "Marquee":       {color:"#7ed9a0", bg:"rgba(126,217,160,0.18)"},
      "Jupiler Stage": {color:"#f0a07a", bg:"rgba(240,160,122,0.18)"},
      "Metal Dome":    {color:"#f0d07a", bg:"rgba(240,208,122,0.18)"},
    },
    days: ["Thursday 18th June","Friday 19th June","Saturday 20th June","Sunday 21st June"],
    dayShort: ["Thu 18","Fri 19","Sat 20","Sun 21"],
    schedule: {
      "South Stage":{
        "Thursday 18th June":[["12:50","13:35","Ego Kill Talent"],["14:30","15:15","Danko Jones"],["16:20","17:10","Accept"],["18:20","19:20","A Day To Remember"],["20:40","21:55","Within Temptation"],["23:30","25:00","The Offspring"]],
        "Friday 19th June":[["12:00","12:45","Quicksand"],["13:50","14:40","Bush"],["15:50","16:40","Cavalera 'Chaos A.D.'"],["17:50","18:40","Sex Pistols ft. Frank Carter"],["20:00","21:00","Alter Bridge"],["22:35","24:05","Volbeat"]],
        "Saturday 20th June":[["12:50","13:35","Fleddy Melculy"],["14:35","15:25","Malevolence"],["16:35","17:25","Hollywood Undead"],["18:35","19:35","Ice Nine Kills"],["20:55","22:10","Architects"],["24:00","25:30","Bring Me The Horizon"]],
        "Sunday 21st June":[["12:00","12:50","Battle Beast"],["14:00","14:50","Life Of Agony"],["16:00","16:50","Extreme"],["18:00","19:00","Black Label Society"],["20:25","21:40","Electric Callboy"],["23:30","25:00","Sabaton"]],
      },
      "North Stage":{
        "Thursday 18th June":[["13:40","14:25","Static-X"],["15:20","16:10","Wind Rose"],["17:20","18:10","Tom Morello"],["19:30","20:30","Megadeth"],["22:05","23:20","Limp Bizkit"]],
        "Friday 19th June":[["14:50","15:40","Drowning Pool"],["16:50","17:40","Mammoth"],["18:50","19:50","Trivium"],["21:10","22:25","Breaking Benjamin"],["24:15","25:35","Knocked Loose"]],
        "Saturday 20th June":[["12:00","12:45","The Pretty Wild"],["13:40","14:25","P.O.D."],["15:35","16:25","Sepultura"],["17:30","18:25","Three Days Grace"],["19:45","20:45","Babymetal"],["22:20","23:50","Bad Omens"]],
        "Sunday 21st June":[["15:00","15:50","Europe"],["17:00","17:50","Foreigner"],["19:10","20:15","Alice Cooper"],["21:50","23:20","Def Leppard"]],
      },
      "Marquee":{
        "Thursday 18th June":[["12:00","12:40","Distant"],["13:15","14:00","Dying Wish"],["14:40","15:30","Snot"],["16:10","17:00","Gatecreeper"],["17:40","18:30","Wolves In The Throne Room"],["19:10","20:00","Septicflesh"],["20:40","21:30","Cult Of Luna"],["22:30","23:45","Anthrax"]],
        "Friday 19th June":[["12:15","12:55","Hulder"],["13:30","14:15","Bark"],["14:50","15:35","Asomvel"],["16:15","17:05","Forbidden"],["17:55","18:45","Old Man's Child"],["19:25","20:15","Possessed"],["20:55","21:45","Death To All"],["22:35","23:35","Cradle of Filth"]],
        "Saturday 20th June":[["12:15","12:55","Embryonic Autopsy"],["13:40","14:25","Sinsaenum"],["15:05","15:50","Uada"],["16:25","17:15","Terrorizer"],["17:55","18:45","Lacuna Coil"],["19:20","20:10","Corrosion Of Conformity"],["20:55","21:45","Moonspell"],["22:35","23:35","Six Feet Under"]],
        "Sunday 21st June":[["12:00","12:40","Killus"],["13:15","14:00","Gaerea"],["14:40","15:30","Decapitated"],["16:10","17:00","Vltimas"],["17:40","18:30","Kanonenfieber"],["19:10","20:00","The Gathering"],["20:40","21:30","Venom"],["22:30","23:45","Mastodon"]],
      },
      "Jupiler Stage":{
        "Thursday 18th June":[["12:40","13:20","Blackgold"],["14:00","14:45","Slay Squad"],["15:40","16:25","Thrown"],["17:25","18:10","Grade 2"],["19:10","20:00","John Coffey"],["21:00","21:50","Pennywise"],["23:00","24:00","The Dillinger Escape Plan"]],
        "Friday 19th June":[["12:40","13:20","Thornhill"],["14:00","14:45","Letlive."],["15:40","16:25","Guilt Trip"],["17:20","18:10","Drain"],["19:10","20:00","We Came As Romans"],["21:00","21:50","Kublai Khan Tx"],["23:00","24:00","Lion Heart"]],
        "Saturday 20th June":[["12:40","13:20","Vicious Rumors"],["14:00","14:45","Feuerschwanz"],["15:40","16:25","Primal Fear"],["17:20","18:10","Orden Ogan"],["19:10","20:00","Sonata Arctica"],["21:00","21:50","Queensryche"],["23:00","24:00","Avatar"]],
        "Sunday 21st June":[["12:40","13:20","Scowl"],["14:00","14:45","Harms Way"],["15:40","16:25","Wargasm"],["17:25","18:10","Set It Off"],["19:10","20:00","Lagwagon"],["21:00","21:50","Bury Tomorrow"],["23:00","24:00","The Plot In You"]],
      },
      "Metal Dome":{
        "Thursday 18th June":[["12:00","12:40","Magnolia Park"],["13:20","14:00","Ankor"],["14:50","15:35","The Funeral Portrait"],["16:30","17:20","Sleep Theory"],["18:15","19:05","Lakeview"],["20:05","20:55","Bloodywood"],["21:55","22:55","President"]],
        "Friday 19th June":[["13:20","14:00","Oranssi Pazuzu"],["16:30","17:15","Harakiri For The Sky"],["18:15","19:05","Elder"],["20:05","20:55","Kadavar"],["21:55","22:55","Leprous"]],
        "Saturday 20th June":[["12:00","12:40","Mouth Culture"],["13:20","14:00","Faetooth"],["14:50","15:35","Rivers Of Nihil"],["16:30","17:15","Loathe"],["18:15","19:05","Catch Your Breath"],["20:05","20:55","Uncle Acid & The Deadbeats"],["21:55","22:55","Tesseract"]],
        "Sunday 21st June":[["12:00","12:40","Return To Dust"],["13:20","14:00","Rain City Drive"],["14:50","15:35","TX2"],["16:30","17:20","Future Palace"],["18:15","19:05","Periphery"],["20:05","20:55","Solstafir"],["21:55","22:55","Carpenter Brut"]],
      },
    },
    priceList: {
      currency: { name: "SKULLY", presale: 3.60, onsite: 3.90, onsiteFrom: "15 June 2026" },
      note: "Price list will be updated as the festival approaches.",
      sections: [
        {
          name: "Soft Drinks & Non-Alcoholic",
          items: [
            { name: "Coca-Cola / Coca-Cola Zero / Fanta / Sprite Zero", detail: "33 CL can", price: 1 },
            { name: "Aquarius Red Peach", detail: "33 CL", price: 1 },
            { name: "Spa Reine & Spa Intense", detail: "50 CL", price: 1 },
            { name: "Red Bull (incl. Watermelon, Zero)", detail: "25 CL", price: 1 },
            { name: "Fuze Tea (Peach Hibiscus, Sparkling Lemon, Green Tea)", detail: "33 CL", price: 1 },
            { name: "Corona Cero 0.0%", detail: "33 CL", price: 1.5 },
          ],
        },
        {
          name: "Beer & Wine",
          items: [
            { name: "Jupiler", detail: "25 CL reuse cup", price: 1 },
            { name: "Jupiler", detail: "50 CL reuse cup", price: 2 },
            { name: "Hoegaarden Rosée", detail: "25 CL", price: 1 },
            { name: "2 Wine — Rosé & Brut", detail: "25 CL can", price: 2.2 },
          ],
        },
        {
          name: "Accessories",
          items: [
            { name: "Cupkeeper", detail: "", price: 1 },
            { name: "Grippo", detail: "", price: 1 },
          ],
        },
      ],
    },
  },

  "2000trees-2026": {
    id: "2000trees-2026",
    name: "2000trees Festival 2026",
    short: "2000TREES 2026",
    location: "Upcote Farm, Cheltenham",
    dates: "8–11 July 2026",
    updated: { lineup: "17 Apr 2026" },
    stages: {
      "Main Stage":      {color:"#e85d75", bg:"rgba(232,93,117,0.18)"},
      "The Cave":        {color:"#7ec8e3", bg:"rgba(126,200,227,0.18)"},
      "The Axiom":       {color:"#e8c547", bg:"rgba(232,197,71,0.18)"},
      "Forest Sessions": {color:"#7ed9a0", bg:"rgba(126,217,160,0.18)"},
      "NEU Stage":       {color:"#c4a0f0", bg:"rgba(196,160,240,0.18)"},
    },
    days: ["Wednesday 8th July","Thursday 9th July","Friday 10th July","Saturday 11th July"],
    dayShort: ["Wed 8","Thu 9","Fri 10","Sat 11"],
    schedule: {
      "Main Stage":{
        "Wednesday 8th July":[],
        "Thursday 9th July":[["11:00","11:30","Buds."],["12:00","12:30","Melanie Baker"],["13:00","13:30","Saint Agnes"],["14:00","14:30","The Skinner Brothers"],["15:00","15:55","Mariachi El Bronx"],["16:30","17:15","Bad Nerves"],["17:55","18:45","Thursday"],["19:45","20:35","PUP"],["21:40","23:00","Alkaline Trio"]],
        "Friday 10th July":[["11:00","11:30","Suds"],["12:00","12:30","Twat Union"],["13:00","13:30","Beauty School"],["14:00","14:35","Higher Power"],["15:05","15:40","House of Protection"],["16:15","17:00","The Scratch"],["17:40","18:30","Lambrini Girls"],["19:30","20:30","Sunny Day Real Estate"],["21:40","23:00","Funeral For A Friend"]],
        "Saturday 11th July":[["11:00","11:30","Carsick"],["12:00","12:30","Frozemode"],["13:00","13:30","Battlesnake"],["14:00","14:30","Heart Attack Man"],["15:00","15:35","Pinkshift"],["16:10","17:00","Mouth Culture"],["17:40","18:30","Marmozets"],["19:30","20:30","Glassjaw"],["21:40","23:00","Neck Deep"]],
      },
      "The Cave":{
        "Wednesday 8th July":[],
        "Thursday 9th July":[["11:00","11:30","Silo"],["12:00","12:30","Long Goodbye"],["13:00","13:30","Hammok"],["14:00","14:30","Still In Love"],["15:00","15:50","Stress Positions"],["16:35","17:10","Bleech 9:3"],["18:00","18:40","Truck Violence"],["19:45","20:35","Delilah Bon"]],
        "Friday 10th July":[["11:00","11:30","Prodigal"],["12:00","12:30","Bratakus"],["13:00","13:30","God Complex"],["14:00","14:30","Reclus.E"],["15:05","15:35","Overgrown"],["16:20","16:55","Saturdays At Your Place"],["17:45","18:30","Banks Arcade"],["19:35","20:25","Militarie Gun"],["21:40","22:40","Cancer Bats"]],
        "Saturday 11th July":[["11:00","11:30","Lickshot"],["12:00","12:30","Luxury Apartments"],["13:00","13:30","Thorns"],["14:00","14:30","Bodyweb"],["15:00","15:35","Dead Pioneers"],["16:15","16:55","Petrol Girls"],["17:45","18:30","I Am The Avalanche"],["19:30","20:30","The Xcerts"],["21:40","22:40","High Vis"]],
      },
      "The Axiom":{
        "Wednesday 8th July":[],
        "Thursday 9th July":[["11:30","12:00","Tooth"],["12:30","13:00","Lonesome"],["13:30","14:00","Happydaze"],["14:30","15:00","Cowboy Hunters"],["15:55","16:30","Coach Party"],["17:15","17:55","Pool Kids"],["18:50","19:40","The Bronx"],["20:40","21:35","Superheaven"]],
        "Friday 10th July":[["11:30","12:00","Guillotine"],["12:30","13:00","Grandmas House"],["13:30","14:00","Footballhead"],["14:35","15:05","Nervus"],["15:40","16:15","Cosmic Psychos"],["17:00","17:40","Free Throw"],["18:35","19:25","Mallory Knox"],["20:35","21:35","Arcane Roots"]],
        "Saturday 11th July":[["11:30","12:00","PeaCH"],["12:30","13:00","Lakes"],["13:30","14:00","Club Brat"],["14:30","15:00","Lastelle"],["15:35","16:10","Have Mercy"],["17:00","17:40","As Everything Unfolds"],["18:35","19:25","HO99O9"],["20:35","21:35","Dinosaur Pile-Up"]],
      },
      "Forest Sessions":{
        "Wednesday 8th July":[["14:00","14:30","Split Dogs"],["15:10","15:40","Karen Dio"],["16:20","16:55","Hyphen"],["17:35","18:10","BLACKGOLD"],["18:50","19:30","The Dirty Nil"],["20:15","21:10","Sprints"],["22:05","23:00","PUP"]],
        "Thursday 9th July":[["11:30","12:00","Saint Senara"],["13:30","14:00","Doss"],["14:30","15:00","Beauty Sleep"],["16:00","16:30","J'cuuzi"],["17:20","17:50","DeadWax"],["18:55","19:35","Native James"],["20:40","21:35","The Virginmarys"],["22:15","23:00","Hyro The Hero"],["23:45","24:35","Haggard Cat"]],
        "Friday 10th July":[["11:30","12:00","Truck"],["12:30","13:00","Sans Froid"],["13:30","14:00","Hotgirl"],["14:35","15:05","SLAG"],["15:35","16:20","Anthony Green"],["18:35","19:20","Greywind"],["20:35","21:25","The Skints"],["22:15","23:00","ALT BLK ERA"],["23:45","24:45","Battlesnake"]],
        "Saturday 11th July":[["12:30","13:00","A Forest"],["13:30","14:00","Vinnie Caruana"],["14:30","15:00","Scustin"],["15:35","16:10","High Regard"],["16:55","17:45","Arcane Roots"],["18:35","19:25","Nothing"],["20:25","21:10","Carolesdaughter"],["21:40","22:40","Bat Sabbath"],["23:25","24:15","Frozemode"]],
      },
      "NEU Stage":{
        "Wednesday 8th July":[],
        "Thursday 9th July":[["10:30","11:00","Highdrive"],["11:30","12:00","Goo"],["12:30","13:00","Ashaine White"],["13:30","14:00","Adore"],["14:30","15:00","Snake Eyes"],["16:00","16:30","Lemonsuckr"],["17:20","17:50","SMUG LLC"],["19:00","19:30","So Good"],["20:40","21:35","The Dirty Nil"]],
        "Friday 10th July":[["10:30","11:00","IOTA"],["11:30","12:00","Aerial Salad"],["12:30","13:00","Glass Bridges"],["13:30","14:00","Knives"],["14:35","15:05","ALISHA"],["15:40","16:10","Call Me Amour"],["17:05","17:35","ElliS-D"],["18:35","19:20","Jayler"],["20:40","21:25","Tropic Gold"]],
        "Saturday 11th July":[["10:30","11:00","Ain't"],["11:30","12:00","THISTLE."],["12:30","13:00","East Exchange"],["13:30","14:00","Bicurious"],["14:30","15:00","Alpha Male Tea Party"],["15:35","16:05","Gallus"],["17:05","17:35","Kent Osbourne"],["18:40","19:15","Big Truck"],["20:50","21:35","Cody Frost"]],
      },
    },
  },

};