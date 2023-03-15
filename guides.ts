// {{Interfaces}}

interface Tourist {
    id: number;
    firstName: string;
    languages: Array<string>;
    goals: Array<number>;
    family: Array<number>
    genger: 'm' | 'f'
}

interface Guide {
    firstName: string;
    company: string;
    languages: Array<string>;
    places: Array<number>;
    genger: 'm' | 'f'
}

interface VisitedPlace {
    id: number;
    title: string;
}

interface GenParams {
    languages: Array<string>;
}

interface ClientsForGuide {
    guide: Guide;
    clients: Array<Tourist>;
}

interface PlaceForReason {
    placeId: number
    
}

interface ProblemWithGuide {
    tourist: Tourist,
    place: number
    reason: "Nėra gido galinčio aprodyti šia vietą" | 
    "Gidas galintis aprodyti šią vietą nemoka turisto klabos"    
}

interface GuidesFromCompany {
    company: string
    guides: Array<Guide>
}

interface People {
    firstName: string,
    genger: 'm' | 'f'
    status: "Gidas" | "Turistas"
}


// {{Arrays}}

const tourists: Array<Tourist> = [
    {
        id: 1,
        firstName: "John",
        languages: ["en", "no"],
        goals: [1, 7],
        family: [5],
        genger: 'm',
    },
    {
        id: 2,
        firstName: "Angelina",
        languages: ["rus"],
        goals: [1, 2, 3, 4],
        family: [],
        genger: 'f',
    },
    {
        id: 3,
        firstName: "Robert",
        languages: ["esp"],
        goals: [1, 2, 3, 5, 8],
        family: [],
        genger: 'm',
    },
    {
        id: 4,
        firstName: "James",
        languages: ["eng", "lv"],
        goals: [4, 8],
        family: [],
        genger: 'm',
    },
    {
        id: 5,
        firstName: "Linda",
        languages: ["lt", "rus", "eng", "fr"],
        goals: [2, 3, 4, 5, 6, 7],
        family: [1],
        genger: 'f',
    },
    {
        id: 6,
        firstName: "Susan",
        languages: ["fr"],
        goals: [2, 3, 4, 5, 6],
        family: [7],
        genger: 'f',
    },
    {
        id: 7,
        firstName: "Thomas",
        languages: ["fr"],
        goals: [2, 3, 4, 5, 6],
        family: [6],
        genger: 'm',
    },
]

const tourGuides: Array<Guide> = [
    {
        firstName: "Ineta",
        company: "Novaturas",
        languages: ["en", "fr", "esp"],
        places: [1, 3, 5, 8],
        genger: 'f',
    },
    {
        firstName: "Skirmantas",
        company: "Tez Tour",
        languages: ["lt", "rus"],
        places: [2, 6],
        genger: 'm',
    },
    {
        firstName: "Agnė",
        company: "AirGuru",
        languages: ["lt", "en", "lv"],
        places: [2, 6],
        genger: 'f',
    },
    {
        firstName: "Ernestas",
        company: "AirGuru",
        languages: ["lt", "lv"],
        places: [1, 2, 6],
        genger: 'm',
    },
]

const visitedPlaces: Array<VisitedPlace> = [
    {
        id: 1,
        title: "Trakų pilis",
    },
    {
        id: 2,
        title: "Gedimino pilis",
    },
    {
        id: 3,
        title: "Lajų takas",
    },
    {
        id: 4,
        title: "Kirkilų apžvalgos bokštas",
    },
    {
        id: 5,
        title: "Ilzenbergo dvaras",
    },
    {
        id: 6,
        title: "Etnokosmologijos muziejus",
    },
    {
        id: 7,
        title: "Buterija Memel Nord",
    },
    {
        id: 8,
        title: "Klinčių karjerai",
    },
]


// {{Functions}}

function getAllLanguages<T extends GenParams>(people: Array<T>): Array<string> {
    let langs: Array<string> = [];
    people.forEach((person) => {
        person.languages.forEach((lang) => {
            if (!langs.includes(lang)) langs.push(lang);
        });
    });
    langs = reSort(langs)
    return langs;
}

function reSort(langs: Array<string>): Array<string> {
    langs.sort();
    return langs;
}

function getClients(tourGuide: Guide, tourists:Array<Tourist>): Array<Tourist> {
    // function returns clients for guides if guide knows any of client goal and language
    return tourists.reduce((arr, tourist) => {
        const foundLangs = tourist.languages.some(lang => tourGuide.languages.includes(lang))
        const foundPlaces = tourist.goals.some(goal => tourGuide.places.includes(goal))
        if (foundLangs && foundPlaces) arr.push(tourist)
        return arr
    }, <Array<Tourist>>[] );
}

function getGuidesForPlace(guides:Array<Guide>, place:Number): Array<Guide> {
    return guides.reduce((arr, guide) => {
        if (guide.places.find(pl => pl === place)) arr.push(guide)
        return arr
    }, <Array<Guide>>[] );
}

function knowsLanguage(guides:Array<Guide>, langs:Array<string>): Array<Guide> {
    return guides.reduce((arr, guide) => {
        if (langs.some(lang => guide.languages.includes(lang))) arr.push(guide)
        return arr
    }, <Array<Guide>>[] );
}

function sadnessWithGuide(guides:Array<Guide>, tourist:Tourist): Array<ProblemWithGuide> {
    const arr: Array<ProblemWithGuide> = []

    tourist.goals.forEach(goal => {
        const guidesWhoKnowsPlace = getGuidesForPlace(guides, goal)
        const knowsLang = knowsLanguage(guidesWhoKnowsPlace, tourist.languages)

        // yra gidas zinantis kalba
        if (!!knowsLang[0]) return
        // nera zinanciu kalbos bet yra zinanaciu vieta
        else if (!!!knowsLang[0] && !!guidesWhoKnowsPlace[0]) {
            const problem:ProblemWithGuide = {place: goal, tourist: tourist,
                reason: "Gidas galintis aprodyti šią vietą nemoka turisto klabos"}
            arr.push(problem)
        }
        // nera zinanciu vietos
        else if (!!!guidesWhoKnowsPlace[0]) {
            const problem:ProblemWithGuide = {place: goal, tourist: tourist,
                reason: "Nėra gido galinčio aprodyti šia vietą"}
            arr.push(problem)
        }
    })
    return arr;
}

function guidesFromCompany(guides:Array<Guide>):Array<GuidesFromCompany> {
    const companiesUnique: Array<string> = [];
    const companies: Array<GuidesFromCompany> = [];

    guides.forEach(guide => {
        if (!companiesUnique.includes(guide.company)) {
            companiesUnique.push(guide.company)
            
            const newGuides:Array<Guide> = []

            guides.forEach(guideFromCompany => {
                if (guideFromCompany.company === guide.company) 
                    newGuides.push(guideFromCompany) 
            })
            companies.push({company: guide.company, guides: newGuides})
        }
    });
    return companies
}

function getByGender(guides:Array<Guide>, tourists:Array<Tourist>):Array<People> {
    const people:Array<People> = []

    guides.forEach(guide => {
        people.push({firstName: guide.firstName, genger: guide.genger, status: "Gidas"})
    })

    tourists.forEach(tourist => {
        people.push({firstName: tourist.firstName, genger: tourist.genger, status: "Turistas"})
    })

    people.sort((a, b) => { if (a.genger < b.genger) return -1; return 1; })
    return people
}



// {{Calls}}

const guideLng = getAllLanguages(tourGuides);
const touristsLng = getAllLanguages(tourists);
const clientLists: Array<ClientsForGuide> = []

tourGuides.forEach(guide => {
    const listForGuide: ClientsForGuide = {
        guide: guide,
        clients: getClients(guide, tourists),
    } 
    clientLists.push(listForGuide)
})

let problemWithGuide: Array<Array<ProblemWithGuide>> = []

tourists.forEach(tourist => {
    problemWithGuide.push( sadnessWithGuide(tourGuides, tourist) )
})

const guidesFromCompanies = guidesFromCompany(tourGuides)

const peopleByGenger = getByGender(tourGuides, tourists)


// {{Return result to html}}

let htmlResult: string = "<h1>Gidai</h1>"
guideLng.forEach((lng) => htmlResult += `<div>${lng}</div>`)

htmlResult += "<h1>Turistai</h1>"
touristsLng.forEach((lng) => htmlResult += `<div>${lng}</div>`)

htmlResult += `<hr></hr>`
clientLists.forEach((listIndex) => {
    htmlResult += `<h3>${listIndex.guide.firstName} iš kompanijos "
    ${listIndex.guide.company}", gali eiti su:</h3>`
    listIndex.clients.forEach((client) => htmlResult += `<div>${client.firstName}</div>`)
})

htmlResult += `<hr></hr> <table border='1'> <tr> <th>Turistas</th> <th>Neaplankys vietos</th> <th>Nes</th>`
problemWithGuide.forEach(touristProblems => {
    touristProblems.forEach(problem => {
        htmlResult += `<tr> <td>  ${problem.tourist.firstName} </td><td> 
        ${visitedPlaces[visitedPlaces.findIndex(x => x.id === problem.place)].title} </td><td> 
        ${problem.reason}</td></tr> `
    })
})
htmlResult += `</table>`

htmlResult += `<hr></hr> <table border='1'> <tr> <th>Kompanija</th> <th>Gidai</th>`
guidesFromCompanies.forEach(company => {
    htmlResult += `<tr> <td> ${company.company} </td>
    <td> ${company.guides?.map(g => g.firstName)} </td> </tr>`
})
htmlResult += `</table>`

htmlResult += `<hr></hr> <table border='1'> <tr> <th>Vardas</th> <th>Lytis</th> <th>Statusas</th> </tr>`
peopleByGenger.forEach(ppl => {
    htmlResult += `<tr> <td> ${ppl.firstName} </td>
    <td> ${ppl.genger} </td> <td> ${ppl.status} </td> </tr>`
})
htmlResult += `</table>`

const el = document.getElementById("guides")
    if (el) el.innerHTML = htmlResult;
