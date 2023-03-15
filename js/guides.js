"use strict";
// {{Interfaces}}
// {{Arrays}}
const tourists = [
    {
        id: 1,
        firstName: "John",
        languages: ["en", "no"],
        goals: [1, 7],
        family: [5],
    },
    {
        id: 2,
        firstName: "Angelina",
        languages: ["rus"],
        goals: [1, 2, 3, 4],
        family: [],
    },
    {
        id: 3,
        firstName: "Robert",
        languages: ["esp"],
        goals: [1, 2, 3, 5, 8],
        family: [],
    },
    {
        id: 4,
        firstName: "James",
        languages: ["eng", "lv"],
        goals: [4, 8],
        family: [],
    },
    {
        id: 5,
        firstName: "Linda",
        languages: ["lt", "rus", "eng", "fr"],
        goals: [2, 3, 4, 5, 6, 7],
        family: [1],
    },
    {
        id: 6,
        firstName: "Susan",
        languages: ["fr"],
        goals: [2, 3, 4, 5, 6],
        family: [7],
    },
    {
        id: 7,
        firstName: "Thomas",
        languages: ["fr"],
        goals: [2, 3, 4, 5, 6],
        family: [6],
    },
];
const tourGuides = [
    {
        firstName: "Ineta",
        company: "Novaturas",
        languages: ["en", "fr", "esp"],
        places: [1, 3, 5, 8],
    },
    {
        firstName: "Skirmantas",
        company: "Tez Tour",
        languages: ["lt", "rus"],
        places: [2, 6],
    },
    {
        firstName: "Agnė",
        company: "AirGuru",
        languages: ["lt", "en", "lv"],
        places: [2, 6],
    },
    {
        firstName: "Ernestas",
        company: "AirGuru",
        languages: ["lt", "lv"],
        places: [1, 2, 6],
    },
];
const visitedPlaces = [
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
];
// {{Functions}}
function getAllLanguages(people) {
    let langs = [];
    people.forEach((person) => {
        person.languages.forEach((lang) => {
            if (!langs.includes(lang))
                langs.push(lang);
        });
    });
    langs = reSort(langs);
    return langs;
}
function reSort(langs) {
    langs.sort();
    return langs;
}
function getClients(tourGuide, tourists) {
    // function returns clients for guides if guide knows any of client goal and language
    return tourists.reduce((arr, tourist) => {
        const foundLangs = tourist.languages.some(lang => tourGuide.languages.includes(lang));
        const foundPlaces = tourist.goals.some(goal => tourGuide.places.includes(goal));
        if (foundLangs && foundPlaces)
            arr.push(tourist);
        return arr;
    }, []);
}
function getGuidesForPlace(guides, place) {
    return guides.reduce((arr, guide) => {
        if (guide.places.find(pl => pl === place))
            arr.push(guide);
        return arr;
    }, []);
}
function knowsLanguage(guides, langs) {
    return guides.reduce((arr, guide) => {
        if (langs.some(lang => guide.languages.includes(lang)))
            arr.push(guide);
        return arr;
    }, []);
}
function sadnessWithGuide(guides, tourist) {
    const arr = [];
    tourist.goals.forEach(goal => {
        const guidesWhoKnowsPlace = getGuidesForPlace(guides, goal);
        const knowsLang = knowsLanguage(guidesWhoKnowsPlace, tourist.languages);
        // yra gidas zinantis kalba
        if (!!knowsLang[0])
            return;
        // nera zinanciu kalbos bet yra zinanaciu vieta
        else if (!!!knowsLang[0] && !!guidesWhoKnowsPlace[0]) {
            const problem = { place: goal, tourist: tourist,
                reason: "Gidas galintis aprodyti šią vietą nemoka turisto klabos" };
            arr.push(problem);
        }
        // nera zinanciu vietos
        else if (!!!guidesWhoKnowsPlace[0]) {
            const problem = { place: goal, tourist: tourist,
                reason: "Nėra gido galinčio aprodyti šia vietą" };
            arr.push(problem);
        }
    });
    // console.log(arr)
    return arr;
}
function guidesFromCompany(guides) {
    const companiesUnique = [];
    const companies = [];
    guides.forEach(guide => {
        if (!companiesUnique.includes(guide.company)) {
            companiesUnique.push(guide.company);
            const newGuides = [];
            guides.forEach(guideFromCompany => {
                if (guideFromCompany.company === guide.company)
                    newGuides.push(guideFromCompany);
            });
            companies.push({ company: guide.company, guides: newGuides });
        }
    });
    return companies;
}
// {{Calls}}
const guideLng = getAllLanguages(tourGuides);
const touristsLng = getAllLanguages(tourists);
const clientLists = [];
tourGuides.forEach(guide => {
    const listForGuide = {
        guide: guide,
        clients: getClients(guide, tourists),
    };
    clientLists.push(listForGuide);
});
let problemWithGuide = [];
tourists.forEach(tourist => {
    problemWithGuide.push(sadnessWithGuide(tourGuides, tourist));
});
const guidesFromCompanies = guidesFromCompany(tourGuides);
// {{Return result to html}}
let htmlResult = "<h1>Gidai</h1>";
guideLng.forEach((lng) => htmlResult += `<div>${lng}</div>`);
htmlResult += "<h1>Turistai</h1>";
touristsLng.forEach((lng) => htmlResult += `<div>${lng}</div>`);
htmlResult += `<hr></hr>`;
clientLists.forEach((listIndex) => {
    htmlResult += `<h3>${listIndex.guide.firstName} iš kompanijos "
    ${listIndex.guide.company}", gali eiti su:</h3>`;
    listIndex.clients.forEach((client) => htmlResult += `<div>${client.firstName}</div>`);
});
htmlResult += `<hr></hr> <table border='1'> <tr> <th>Turistas</th> <th>Neaplankys vietos</th> <th>Nes</th>`;
problemWithGuide.forEach(touristProblems => {
    touristProblems.forEach(problem => {
        htmlResult += `<tr> <td>  ${problem.tourist.firstName} </td><td> 
        ${visitedPlaces[visitedPlaces.findIndex(x => x.id === problem.place)].title} </td><td> 
        ${problem.reason}</td></tr> `;
    });
});
htmlResult += `</table>`;
htmlResult += `<hr></hr> <table border='1'> <tr> <th>Kompanija</th> <th>Gidai</th>`;
console.log(guidesFromCompanies);
guidesFromCompanies.forEach(company => {
    var _a;
    htmlResult += `<tr> <td> ${company.company} </td>
    <td> ${(_a = company.guides) === null || _a === void 0 ? void 0 : _a.map(g => g.firstName)} </td> </tr>`;
});
htmlResult += `</table>`;
const el = document.getElementById("guides");
if (el)
    el.innerHTML = htmlResult;
