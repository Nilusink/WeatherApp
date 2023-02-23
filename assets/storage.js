/*
storage.js
23. February 2023

Manages everything that gets stored

Author:
Nilusink
*/
import AsyncStorage from '@react-native-async-storage/async-storage';


/**
 * get all favourite stations as array
 * @param setter int[ ]
 */
export function getFavourites(setter)
{
    try {
        AsyncStorage.getItem('@favourites')
            .then(response => {
                return JSON.parse(response);
            })
            .then(json => {
                if (json == undefined)
                {
                    setter([]);
                }
                else
                {
                    setter(json);
                }
            })
            .catch(error => {
                console.error(error);
            });
    } catch(e) {
        console.log("reading error");
    }
}

/**
 * set the favourit item
 * @param id unsigned int: the stations id
 * @param isFavourite bool: favourite or not
 */
export function setFavourite(id, isFavourite)
{
    function addFavourite(favs)
    {
        if (isFavourite)
        {
            if (!(favs.includes(id)))
            {
                favs.push(id);
            }
        }
        else
        {
            if ((favs.includes(id)))
            {
                favs.pop(favs.indexOf(id));
            }
        }

        // store
        try {
            const jsonValue = JSON.stringify(favs);
            AsyncStorage.setItem('@favourites', jsonValue)
                .then(response => {
                })
                .catch(error => {
                    console.error(error);
                });

        } catch (e) {
            console.log("error when saving favourites");
        }

    }
    getFavourites(addFavourite);
}
