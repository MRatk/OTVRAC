# OTVRAC
# Skup podataka: Mobiteli

Ovaj dataset sadrži popis 10 različith mobitela s pripadajućim godinama izdavanj i tvrtkom koja ih je napravila i izdvojenim verzijama. Podatci su organizirani na načina da imaju vezu roditelj-dijete između mobitela i verzija. U repozitoriju podatci su dostupni u JSON i CVS formatu.

## Metapodaci
- **Autor**: Mihael Ratkovčić
- **Licenca**: Creative Commons Attribution 4.0 International (CC BY 4.0)
- **Verzija**: 1.0
- **Jezik**: Hrvatski
- **Atributi**:
  - Podatci iz baze roditelj:
    - `ime_modela`: Ime mobitela
    - `tvrtka`: Ime tvrtke koja ga je napravila
    - `godina_proizvodnje`: Godina u kojoj je mobitel proizveden
  
  - Podatci iz baze dijete:
    - `naziv_verzije`: Verzija mobitela
    - `cijena`: Cijena mobitela u američkim dolarima
    - `operacijski_sustav`: Operacijski sustav instaliran na mobitelu
    - `RAM`: Količina RAM memorije u GB
    - `tezina_gram`: Težina mobitela u gramima
    - `kamera_mp`: Količina megapiksela kamere
    - `visina_inch`: Visina mobitela u inčima
    - `baterija_mah`: Snaga baterije u mAh

Shield: [![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg



