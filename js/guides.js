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
];
const tourGuides = [
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
function getByGender(guides, tourists) {
    const people = [];
    guides.forEach(guide => {
        people.push({ firstName: guide.firstName, genger: guide.genger, status: "Gidas" });
    });
    tourists.forEach(tourist => {
        people.push({ firstName: tourist.firstName, genger: tourist.genger, status: "Turistas" });
    });
    people.sort((a, b) => { if (a.genger < b.genger)
        return -1; return 1; });
    return people;
}
function getFamilies(tourists) {
    const families = [];
    const notUniqueIds = [];
    tourists.forEach(tourist => {
        if (tourist.family[0]) {
            if (!notUniqueIds.find(x => x === tourist.id)) {
                const family = [];
                notUniqueIds.push(tourist.id);
                family.push(tourist);
                tourist.family.forEach(familyMemberId => {
                    const familyMember = tourists[tourists.findIndex(x => x.id === familyMemberId)];
                    notUniqueIds.push(familyMemberId);
                    family.push(familyMember);
                });
                families.push(family);
            }
        }
    });
    return families;
}
function findGuidesForGoals(guides, goals, needsGuidesArg = []) {
    let needsGuides = [];
    // Find guide who can show most places
    let bestGuideOption = guides[0];
    let bestFit = 0;
    guides.forEach(guide => {
        let goalsFit = 0;
        guide.places.forEach(place => {
            if (goals.includes(place))
                goalsFit++;
        });
        if (goalsFit > bestFit) {
            bestGuideOption = guide;
            bestFit = goalsFit;
        }
    });
    // include guide and recall function without these goals
    needsGuides.push(bestGuideOption);
    bestGuideOption.places.forEach(place => {
        const index = goals.findIndex(x => x === place);
        if (index > -1)
            goals.splice(index, 1);
    });
    // make sure we can get guide for left goals
    let canVisitMore = false;
    guides.forEach(guide => {
        goals.forEach(goal => {
            if (guide.places.includes(goal))
                canVisitMore = true;
        });
    });
    if (goals.length != 0 && canVisitMore)
        findGuidesForGoals(guides, goals, needsGuides).forEach(guide => needsGuides.push(guide));
    return needsGuides;
}
function getFamiliesGoals(family) {
    const goals = [];
    family.forEach(familyMember => {
        familyMember.goals.forEach(goal => {
            if (!goals.includes(goal))
                goals.push(goal);
        });
    });
    return goals;
}
function getPlacesPrioraty(tourists, places) {
    const placePrioraty = [];
    places.forEach(place => {
        let prioraty = 0;
        let touristsToPlace = [];
        tourists.forEach(tourist => {
            if (tourist.goals.includes(place.id))
                touristsToPlace.push(tourist);
        });
        placePrioraty.push({ place: place, tourists: touristsToPlace });
    });
    placePrioraty.sort((firstItem, secondItem) => secondItem.tourists.length - firstItem.tourists.length);
    return placePrioraty;
}
function getBestPlaceForGuide(guides, tourists, places) {
    const guidesPlan = [];
    // {{ Settings }}
    const onlyOnePlaceForPerson = false;
    const touristKnowsGuideLang = false;
    const addTouristsWhoDoesntKnowLang = false;
    const skipTourists = [];
    const skipPlaces = [];
    guides.forEach(guide => {
        const placePrioraty = getPlacesPrioraty(tourists, places);
        let bestFitPoints = 0;
        let bestPlaceForGuideOutput = [];
        let fitTouristsOutput = [];
        placePrioraty.forEach(place => {
            const bestPlaceForGuide = [];
            const fitTourists = [];
            if (guide.places.find(placeG => placeG === place.place.id) && !skipPlaces.includes(place.place)) {
                place.tourists.forEach(tourist => {
                    if ((tourist.languages.some(lang => guide.languages.includes(lang)) || !touristKnowsGuideLang) && !skipTourists.includes(tourist)) {
                        fitTourists.push(tourist);
                        if (bestFitPoints <= fitTourists.length) {
                            bestFitPoints = fitTourists.length;
                            bestPlaceForGuide.push(place.place);
                            bestPlaceForGuideOutput = bestPlaceForGuide;
                            fitTouristsOutput = fitTourists;
                        }
                    }
                });
            }
        });
        if (bestPlaceForGuideOutput[0]) {
            const place = bestPlaceForGuideOutput[bestPlaceForGuideOutput.length - 1];
            const knowsLang = [];
            skipPlaces.push(place);
            fitTouristsOutput.forEach(tourist => {
                if (onlyOnePlaceForPerson) {
                    skipTourists.push(tourist);
                }
                knowsLang.push(true);
            });
            if (addTouristsWhoDoesntKnowLang) {
                tourists.forEach(tourist => {
                    if (tourist.goals.includes(place.id) && !fitTouristsOutput.includes(tourist) && !skipTourists.includes(tourist)) {
                        fitTouristsOutput.push(tourist);
                        knowsLang.push(false);
                    }
                });
            }
            // All variables in this line vvvvvvvvvvvvvvvvvvv
            // console.log(bestFitPoints, guide, place, fitTouristsOutput)
            const newPlan = {
                place: place,
                guide: guide,
                tourists: fitTouristsOutput,
                knowsLang: knowsLang,
                onePerPlaceFilter: onlyOnePlaceForPerson,
                knowsLangFilter: touristKnowsGuideLang,
                addAll: addTouristsWhoDoesntKnowLang,
            };
            guidesPlan.push(newPlan);
        }
    });
    return guidesPlan;
}
// function sendGuides(guidesOrginal:Array<Guide>, tourists:Array<Tourist>, places:Array<VisitedPlace>) {
//     const guides = guidesOrginal
//     // Get places prioraty
//     const placePrioraty = getPlacesPrioraty(tourists, places)
//     // find best fitting guides for prioraty places
//     // let placeCheckpoint = 0
//     // while (guides.length !== 0 || placeCheckpoint < placePrioraty.length -1) {
//     placePrioraty.forEach(place => {
//         // let place = placePrioraty[placeCheckpoint]
//         let bestFitPoints = 0
//         let bestGuide:Array<Guide> = []
//         let fitTourists:Array<Tourist> = []
//         guides.forEach(guide => {
//             fitTourists = []
//             if (guide.places.find(placeG => placeG === place.place.id)) {
//                 place.tourists.forEach(tourist => {
//                     if (tourist.languages.some(lang => guide.languages.includes(lang))) {
//                         fitTourists.push(tourist)
//                         if (bestFitPoints < fitTourists.length) {bestFitPoints = fitTourists.length; bestGuide.push(guide)}
//                     }
//                 })
//             }
//         })
//         if (bestGuide[0]) {
//             // All variables in this line vvvvvvvvvvvvvvvvvvv
//             // console.log(bestFitPoints, bestGuide[bestGuide.length - 1], place, fitTourists)
//             //remove guide from array
//             const indexG = guides.findIndex(x => x === bestGuide[bestGuide.length - 1])
//             guides.splice(indexG, 1)
//         }
//         if (guides.length === 0) return
//         // placeCheckpoint ++
//     })
//     // }
//     // Get guides prioraty by langs and places prioraty
//     // expecting 4 lines output:
//     // place, guide, turistas[i], ar turistas[i] moka gido kalba
// }
// sendGuides(tourGuides, tourists, visitedPlaces)
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
const peopleByGenger = getByGender(tourGuides, tourists);
const guidesPlan = getBestPlaceForGuide(tourGuides, tourists, visitedPlaces);
// {{Return result to html}}
// Guides Languages
let htmlResult = "<h1>Gidai</h1>";
guideLng.forEach((lng) => htmlResult += `<div>${lng}</div>`);
// Tourists
htmlResult += "<h1>Turistai</h1>";
touristsLng.forEach((lng) => htmlResult += `<div>${lng}</div>`);
htmlResult += `<hr></hr>`;
clientLists.forEach((listIndex) => {
    htmlResult += `<h3>${listIndex.guide.firstName} iš kompanijos "
    ${listIndex.guide.company}", gali eiti su:</h3>`;
    listIndex.clients.forEach((client) => htmlResult += `<div>${client.firstName}</div>`);
});
// Sadness with guides
htmlResult += `<hr></hr> <table border='1'> <tr> <th>Turistas</th> <th>Neaplankys vietos</th> <th>Nes</th>`;
problemWithGuide.forEach(touristProblems => {
    touristProblems.forEach(problem => {
        htmlResult += `<tr> <td>  ${problem.tourist.firstName} </td><td> 
        ${visitedPlaces[visitedPlaces.findIndex(x => x.id === problem.place)].title} </td><td> 
        ${problem.reason}</td></tr> `;
    });
});
htmlResult += `</table>`;
// Guides From Companies
htmlResult += `<hr></hr> <table border='1'> <tr> <th>Kompanija</th> <th>Gidai</th>`;
guidesFromCompanies.forEach(company => {
    var _a;
    htmlResult += `<tr> <td> ${company.company} </td>
    <td> ${(_a = company.guides) === null || _a === void 0 ? void 0 : _a.map(g => g.firstName)} </td> </tr>`;
});
htmlResult += `</table>`;
// Genger
htmlResult += `<hr></hr> <table border='1'> <tr> <th>Vardas</th> <th>Lytis</th> <th>Statusas</th> </tr>`;
peopleByGenger.forEach(ppl => {
    htmlResult += `<tr> <td> ${ppl.firstName} </td>
    <td> ${ppl.genger} </td> <td> ${ppl.status} </td> </tr>`;
});
htmlResult += `</table>`;
// Families
htmlResult += `<hr></hr> <table border='1'> <tr> <th>Seimos nariai</th> <th>Reikalingi gidai</th> <th>Vietos kurioms nera gido</th> </tr>`;
getFamilies(tourists).forEach(family => {
    const familyGoals = getFamiliesGoals(family);
    const familyGuides = findGuidesForGoals(tourGuides, familyGoals);
    htmlResult += `<tr> <td> ${family.map(member => member.firstName)} </td> 
    <td> ${familyGuides.map(guide => guide.firstName)} </td>
    <td> ${familyGoals.map(goal => visitedPlaces[visitedPlaces.findIndex(x => x.id === goal)].title)} </td> </tr>`;
});
htmlResult += `</table>`;
// Guides plan
console.log(guidesPlan);
htmlResult += `<hr></hr> <div><strong>{{ Settings }} </strong> </div>
<div>Vienam turistui skiriama tik viena lankytina vieta: <strong>${guidesPlan[0].onePerPlaceFilter}</strong></div>
<div>Skaiciuoti tik tuos turistus kurie moka gido kalba: <strong>${guidesPlan[0].knowsLangFilter}</strong></div>
<div>Prideti turistus nemokancius kalbos (kaip siulima): <strong>${guidesPlan[0].addAll}</strong></div>
<div> - </div>

<table border='1'> <tr> <th>Vieta</th> <th>Gidas</th> <th>Turistai</th> <th>Turistas iskaičiuotas*</th> </tr>`;
guidesPlan.forEach(plan => {
    htmlResult += `<tr> <td>${plan.place.title}</td> <td>${plan.guide.firstName}</td> <td>`;
    plan.tourists.forEach(tourist => { htmlResult += `<div>${tourist.firstName}</div>`; });
    htmlResult += `</td> <td>`;
    plan.knowsLang.forEach(val => { htmlResult += `<div>${val ? 'įskaičiuotas' : 'siūlomas'}</div>`; });
    htmlResult += `</td> </tr>`;
});
htmlResult += `</table>
<div>*Turistas iskaičiuotas kai moka gido kalbą, visi neiskaičiuoti turistai yra siūlymas paimti kartu, gidas nebus samdomas jei nebus iskaičiuotu turistu!</div>`;
const el = document.getElementById("guides");
if (el)
    el.innerHTML = htmlResult;
