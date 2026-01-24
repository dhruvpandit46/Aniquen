        // ==============================================
        // PERMANENT OFFLINE STORAGE SOLUTION FOR AUDIO FILES
        // ==============================================
        /*
        PROBLEM with createObjectURL():
        --------------------------------
        URL.createObjectURL(file) creates a temporary URL that:
        1. Is tied to the current browser session
        2. Expires when the page is closed/refreshed
        3. Does NOT persist across browser restarts
        4. The actual file data is NOT stored anywhere
        
        SOLUTION: Store BLOB in IndexedDB
        ---------------------------------
        We need to:
        1. Read the audio file as an ArrayBuffer or Blob
        2. Store the complete binary data in IndexedDB
        3. When loading the app, retrieve the Blob from IndexedDB
        4. Create a new object URL from the stored Blob
        5. This URL will be valid as long as we keep the Blob reference
        */

        // Enhanced music library with 40 demo songs and image support
        let musicLibrary = [
{
id: 1,
title: "SLAVA FUNK",
artist: "DEVSQUAD",
duration: "3:12",
genre: "Funk",
color: "#7B61FF",
image: "https://i.scdn.co/image/ab67616d0000b273d11d4363c7a6cb9a2411565c",
file: "SLAVA FUNK!.mp3",
isDemo: true
},
{
id: 2,
title: "FUNK DE BELEZA",
artist: "DJ FURIA",
duration: "2:58",
genre: "Funk",
color: "#5D43E6",
image: "https://i1.sndcdn.com/artworks-qyUnxRdsw7vI1YlM-O6yGtQ-t1080x1080.png",
file: "FUNK DE BELEZA.mp3",
isDemo: true
},
{
id: 3,
title: "HANUMANHIND BIG DAWGS",
artist: "BIG DAWGS",
duration: "3:55",
genre: "Phonk",
color: "#FF6B6B",
image: "https://tse1.explicit.bing.net/th/id/OIP.tOat9wSVh6BAYkDRAwBKLQAAAA?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
file: "Hanumankind Big Dawgs.mp3",
isDemo: true
},
{
id: 4,
title: "MATUSHKA ULTRAFUNK",
artist: "ULTRA BEAT",
duration: "3:25",
genre: "Funk",
color: "#00E5A8",
image: "https://lh3.googleusercontent.com/a7-QDAb4c6BoAkxJmcOLYE4TvsQjrf-w-KwWIomzSd3a8F8Z3dMNhYg5ACMN5Ml5ZGg9VuvuTvYn33e4=w544-h544-l90-rj",
file: "Matushka Ultrafunk.mp3",
isDemo: true
},
{
id: 5,
title: "PASSO BEM SOLTO",
artist: "MC PASO",
duration: "2:48",
genre: "Brazil Funk",
color: "#FFB74D",
image: "https://i.ytimg.com/vi/OjQyMOS1CvE/maxresdefault.jpg",
file: "PASSO BEM SOLTO.mp3",
isDemo: true
},
{
id: 6,
title: "SAPPHIRE",
artist: "CRYSTAL FUNK",
duration: "3:35",
genre: "Phonk",
color: "#9D8AFF",
image: "https://i.ytimg.com/vi/JgDNFQ2RaLQ/maxresdefault.jpg",
file: "Sapphire.mp3",
isDemo: true
},
{
id: 7,
title: "FUNK SIGILO ULTRA SLOWED",
artist: "ULTRA SLOWED",
duration: "4:55",
genre: "Slow Funk",
color: "#2C2C2C",
image: "https://i.ytimg.com/vi/LPIc5deNcHM/maxresdefault.jpg",
file: "FUNK SIGILO (ULTRA SLOWED).mp3",
isDemo: true
},
{
id: 8,
title: "MORTALS FUNK SLOWED",
artist: "NCS FUNK",
duration: "4:42",
genre: "Slow Phonk",
color: "#1A1A1A",
image: "https://lh3.googleusercontent.com/Z2pUvTmPcvFi0hDCmGptsCkSUagLmgFReYBEgTt-IhSNmFiM1KlMs51-wof19UdZCvmjgRnrc06KtiDU",
file: "MORTALS FUNK SLOWED.mp3",
isDemo: true
},

{
id: 9,
title: "SMACK THAT (SLOWED + REVERB)",
artist: "AKON",
duration: "4:58",
genre: "Slowed",
color: "#333333",
image: "https://i.ytimg.com/vi/hvJk374NYCI/maxresdefault.jpg",
file: "SMACK THAT (SLOWED + REVERB).mp3",
isDemo: true
},
{
id: 10,
title: "SAKA SAKA SAKA",
artist: "MC SAKA",
duration: "2:55",
genre: "Brazil Funk",
color: "#FF6B9D",
image: "https://tse1.mm.bing.net/th/id/OIP.6R-xEclr--hqoPVtdNAlKQAAAA?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
file: "SAKA SAKA SAKA.mp3",
isDemo: true
},
{
id: 11,
title: "VILLAGE FUNK",
artist: "RUSTIC BEATZ",
duration: "3:40",
genre: "Funk",
color: "#5D43E6",
image: "https://lh3.googleusercontent.com/0vch5yix1yy6fFJW3xkUA-PggQjKRoH4dM1RiWaqmR6U_dKrSwKC9HPVrazTfXXkhr3RkBrZHMBvUOZP",
file: "VILLAGE FUNK.mp3",
isDemo: true
},
{
id: 12,
title: "SWEET DREAMS ULTRAFUNK",
artist: "ULTRA REMIX",
duration: "4:12",
genre: "Phonk",
color: "#7B61FF",
image: "https://i.ytimg.com/vi/19ktQrQyYnM/maxresdefault.jpg",
file: "SWEET DREAMS ULTRAFUNK.mp3",
isDemo: true
},
{
id: 13,
title: "ASCEND (SLOWED)",
artist: "NEWHOPE",
duration: "5:25",
genre: "Slowed",
color: "#1A1A1A",
image: "https://i.ytimg.com/vi/tx8iGleOODk/maxresdefault.jpg",
file: "ASCEND - Slowed.mp3",
isDemo: true
},
{
id: 14,
title: "BALKAN FUNK",
artist: "EAST GROOVE",
duration: "3:50",
genre: "Funk",
color: "#FFB74D",
image: "https://i1.sndcdn.com/artworks-ZyJ7eUzaR9bnqrOf-krHw5Q-t500x500.jpg",
file: "BALKAN FUNK.mp3",
isDemo: true
},
{
id: 15,
title: "VIOLENTO",
artist: "MC BRUTAL",
duration: "2:58",
genre: "Brazil Funk",
color: "#FF6B6B",
image: "https://i.ytimg.com/vi/VmsdXg_yRwo/oardefault.jpg?sqp=-oaymwEkCJUDENAFSFqQAgHyq4qpAxMIARUAAAAAJQAAyEI9AICiQ3gB&rs=AOn4CLCArgVpZDKc9brwL41zmbnLbLEt9g",
file: "VIOLENTO.mp3",
isDemo: true
},
{
id: 16,
title: "CANTO DE LUNA",
artist: "LUNA GROOVE",
duration: "3:44",
genre: "Phonk",
color: "#9D8AFF",
image: "https://lh3.googleusercontent.com/hQTqBY69g6ao-u_UqUXJFKfj0cPkLmNlNJ3fVBLcOzb6V0QosV_IZfE4xoIQWqSShN3DYDd5TZ_1YZM",
file: "CANTO DE LUNA.mp3",
isDemo: true
},
{
id: 17,
title: "AVANGARD (SLOWED)",
artist: "AVANGARD",
duration: "4:55",
genre: "Slowed",
color: "#2C2C2C",
image: "https://i.scdn.co/image/ab67616d0000b27389cad173e6b749ae9bd45f17",
file: "AVANGARD (Slowed  Reverb).mp3",
isDemo: true
},
{
id: 18,
title: "EL BEIBI FUNK",
artist: "MC BEIBI",
duration: "3:28",
genre: "Funk",
color: "#FF6B9D",
image: "https://lh3.googleusercontent.com/MuqlUlHOy8n1VCq5-P9m8WPYSRfjuBZUHczfyvIGTl8AOZgyvaXxYmdFRRy8Y6eAAiSzX3c1SIvtZwc",
file: "EL BEIBI FUNK.mp3",
isDemo: true
},
{
id: 19,
title: "LET'S GO GAMBLING",
artist: "NIGHT RUNNER",
duration: "3:52",
genre: "Phonk",
color: "#000000",
image: "https://i.ytimg.com/vi/ABhMstFO1zk/maxresdefault.jpg",
file: "LET'S GO GAMBLING.mp3",
isDemo: true
},
{
id: 20,
title: "CONFESS YOUR LOVE FUNK",
artist: "EDWARD MAYA (FUNK REMIX)",
duration: "4:05",
genre: "Funk",
color: "#5D43E6",
image: "https://i.ytimg.com/vi/-KBKEPOorVg/maxresdefault.jpg",
file: "CONFESS YOUR LOVE FUNK.mp3",
isDemo: true
},
{
id: 21,
title: "ODNOGO ULTRAFUNK (Slowed)",
artist: "ULTRA REMIX",
duration: "3:48",
genre: "Phonk",
color: "#7B61FF",
image: "https://i.ytimg.com/vi/96Xj47r-kE0/maxresdefault.jpg",
file: "ODNOGO ULTRAFUNK ULTRA SLOWED.mp3",
isDemo: true
},
{
id: 22,
title: "Vem Vem (Super Slowed)",
artist: "DJ NANDO",
duration: "2:42",
genre: "Brazil Funk",
color: "#FFB74D",
image: "https://i1.sndcdn.com/artworks-yBbJnsPbFwvhxZKD-DH1IOQ-t1080x1080.jpg",
file: "Vem Vem (Super Slowed).mp3",
isDemo: true
},
{
id: 23,
title: "NO ERA AMOR (Super Slowed)",
artist: "DJ LATINA",
duration: "3:35",
genre: "Latin Funk",
color: "#FF6B6B",
image: "https://i.scdn.co/image/ab67616d0000b273e7447c70e1953a8b8ca24e38",
file: "NO ERA AMOR (Super Slowed).mp3",
isDemo: true
},
{
id: 24,
title: "FUNK OSCURO (Super Slowed)",
artist: "DARK PHONK",
duration: "4:05",
genre: "Dark Phonk",
color: "#000000",
image: "https://c.saavncdn.com/443/FUNK-OSCURO-Unknown-2024-20241023124118-500x500.jpg",
file: "FUNK OSCURO (Super Slowed).mp3",
isDemo: true
},
{
id: 25,
title: "TAK TAK (Slowed)",
artist: "MC TAK",
duration: "2:58",
genre: "Brazil Funk",
color: "#FF8FB3",
image: "https://c.saavncdn.com/739/TAK-TAK-English-2025-20250306184720-500x500.jpg",
file: "TAK TAK (Slowed).mp3",
isDemo: true
},
{
id: 26,
title: "Shaitaan Theme",
artist: "AMIT TRIVEDI",
duration: "4:25",
genre: "Dark Orchestral",
color: "#2C2C2C",
image: "https://c.saavncdn.com/218/Shaitaan-Theme-From-Shaitaan-Hindi-2024-20240307120243-500x500.jpg",
file: "Shaitaan Theme.mp3",
isDemo: true
},
{
id: 27,
title: "UNSTOPPABLE",
artist: "SIA (PHONK REMIX)",
duration: "3:18",
genre: "Phonk",
color: "#5D43E6",
image: "https://c.saavncdn.com/203/This-Is-Acting-English-2016-500x500.jpg",
file: "Unstoppable.mp3",
isDemo: true
},
{
id: 28,
title: "BELIEVER",
artist: "IMAGINE DRAGONS (FUNK REMIX)",
duration: "3:25",
genre: "Funk",
color: "#FF6B6B",
image: "https://c.saavncdn.com/248/Evolve-English-2017-20180716230950-500x500.jpg",
file: "Believer.mp3",
isDemo: true
},
{
id: 29,
title: "ASTRONAUT IN THE OCEAN",
artist: "MASKED WOLF (PHONK REMIX)",
duration: "3:45",
genre: "Phonk",
color: "#7B61FF",
image: "https://c.saavncdn.com/102/Astronaut-In-The-Ocean-English-2021-20210825045729-500x500.jpg",
file: "Astronaut In The Ocean.mp3",
isDemo: true
},
{
id: 30,
title: "SMACK THAT (SLOWED)",
artist: "AKON",
duration: "4:40",
genre: "Slowed",
color: "#000000",
image: "https://c.saavncdn.com/126/smack-that-slowed-reverb-Unknown-2023-20230712103031-500x500.jpg",
file: "SMACK THAT (SLOWED).mp3",
isDemo: true
},
{
id: 31,
title: "BEGGIN'",
artist: "MÅNESKIN (FUNKO REMIX)",
duration: "3:28",
genre: "Funk",
color: "#FFB74D",
image: "https://c.saavncdn.com/755/Chosen-English-2017-20171204141141-500x500.jpg",
file: "Beggin'.mp3",
isDemo: true
},
{
id: 32,
title: "BELLY DANCER",
artist: "AKON (PHONK REMIX)",
duration: "3:52",
genre: "Phonk",
color: "#5D43E6",
image: "https://c.saavncdn.com/330/Belly-Dancer-English-2022-20250919224150-500x500.jpg",
file: "Belly Dancer.mp3",
isDemo: true
},
{
id: 33,
title: "PYTHON FUNK",
artist: "DEVBEAT",
duration: "3:15",
genre: "Tech Funk",
color: "#7B61FF",
image: "https://c.saavncdn.com/072/PYTHON-FUNK-English-2024-20240831070936-500x500.jpg",
file: "PYTHON FUNK.mp3",
isDemo: true
},
{
id: 34,
title: "FUNK UNIVERSO",
artist: "AKON (PHONK REMIX)",
duration: "2:07",
genre: "Phonk",
color: "#5D43E6",
image: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3a/1a/26/3a1a2678-35f4-52f4-22c6-60d59ebf9f8e/198588478509.jpg/1200x1200bf-60.jpg",
file: "song/FUNK UNIVERSO.mp3",
isDemo: true
},
{
id: 35,
title: "FUNK SECRETO ULTRA SLOWED",
artist: "AKON (PHONK REMIX)",
duration: "1:29",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.ytimg.com/vi/Xm8nn0YC4bM/maxresdefault.jpg",
file: "song/FUNK SECRETO ULTRA SLOWED.mp3",
isDemo: true
},
{
id: 36,
title: "JUJALARIM FUNK",
artist: "AKON (PHONK REMIX)",
duration: "2:01",
genre: "Phonk",
color: "#5D43E6",
image: "https://images.genius.com/82e12f25f5cad6d309b39a769c1d516b.640x640x1.jpg",
file: "song/JUJALARIM FUNK.mp3",
isDemo: true
},
{
id: 37,
title: "PACIENTE FUNK",
artist: "AKON (PHONK REMIX)",
duration: "1:07",
genre: "Phonk",
color: "#5D43E6",
image: "https://audio.com/s3w/audio.com.static/audio/image/48/51/1832275127475148-1832275161666939.jpeg",
file: "song/Paciente_Funk.mp3",
isDemo: true
},
{
id: 38,
title: "AIRTEL PHONK",
artist: "AKON (PHONK REMIX)",
duration: "1:32",
genre: "Phonk",
color: "#5D43E6",
image: "https://audio.com/s3w/audio.com.static/audio/image/46/31/1849326047883146-1849326069606548.jpeg",
file: "song/AIRTEL PHONK.mp3",
isDemo: true
},
{
id: 39,
title: "Another Love",
artist: "AKON (PHONK REMIX)",
duration: "4:04",
genre: "Phonk",
color: "#5D43E6",
image: "https://a10.gaanacdn.com/gn_img/albums/ZaP37RKDy7/P374vkkBWD/size_m.jpg",
file: "song/Another Love.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 40,
title: "BAD PARENTING FUNK V2",
artist: "AKON (PHONK REMIX)",
duration: "1:49",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.ytimg.com/vi/bN3HLty5msk/maxresdefault.jpg",
file: "song/BAD PARENTING FUNK V2 (Ultra Slowed).mp3",
isDemo: true
},
{
id: 41,
title: "BLOODY! (ULTRA SLOWED)",
artist: "AKON (PHONK REMIX)",
duration: "2:19",
genre: "Phonk",
color: "#5D43E6",
image: "https://lh3.googleusercontent.com/Q1aHz2c2F5c9upRblEVv2iB9ucEll4flTHsiYtoMtOvD_vqhctdu5L74kx1ObXANokyQxXFdpD0R96VM",
file: "song/BLOODY! (ULTRA SLOWED).mp3",
isDemo: true
},
{
id: 42,
title: "BLUE HORIZON FUNK - ULTRA SLOWED",
artist: "AKON (PHONK REMIX)",
duration: "2:01",
genre: "Phonk",
color: "#5D43E6",
image: "https://a10.gaanacdn.com/gn_img/albums/Oxd3xP3gVY/d3xDlxlY3g/size_m.jpg",
file: "song/BLUE HORIZON FUNK - ULTRA SLOWED.mp3",
isDemo: true
},
{
id: 43,
title: "Boys Interface - Slowed",
artist: "AKON (PHONK REMIX)",
duration: "2:55",
genre: "Phonk",
color: "#5D43E6",
image: "https://s.mxmcdn.net/images-storage/albums2/9/0/2/6/1/0/80016209_500_500.jpg",
file: "song/Boys Interface - Slowed.mp3",
isDemo: true
},
{
id: 44,
title: "CORRUPÇÃO FUNK RJ",
artist: "AKON (PHONK REMIX)",
duration: "1:19",
genre: "Phonk",
color: "#5D43E6",
image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5e/e5/02/5ee502a3-fb6c-1c60-b2fb-493b86c5f496/cover.jpg/800x800cc.jpg",
file: "song/CORRUPÇÃO FUNK RJ.mp3",
isDemo: true
},
{
id: 45,
title: "Cuando se te moja la tarea 2 (Slowed)",
artist: "AKON (PHONK REMIX)",
duration: "3:30",
genre: "Phonk",
color: "#5D43E6",
image: "https://assets.audiomack.com/ldrr-1/11305977-3617389751538.jpg?width=1000&height=1000&max=true",
file: "song/Cuando se te moja la tarea 2 (Slowed).mp3",
isDemo: true
},
{
id: 46,
title: "Death Is No More",
artist: "AKON (PHONK REMIX)",
duration: "2:18",
genre: "Phonk",
color: "#5D43E6",
image: "https://th.bing.com/th/id/R.902a15d9a12a71b37f367764c8de1ca6?rik=RA760OJEujPiVg&riu=http%3a%2f%2fimg3.kuwo.cn%2fstar%2falbumcover%2f500%2fs3s17%2f49%2f1052657244.jpg&ehk=fjVyO%2bUwX6DqtUbocnlHOIAkEYqau1yWMWYt5BOCif8%3d&risl=&pid=ImgRaw&r=0",
file: "song/Death Is No More.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 47,
title: "Devil Eyes",
artist: "AKON (PHONK REMIX)",
duration: "2:11",
genre: "Phonk",
color: "#5D43E6",
image: "https://imagescdn.junodownload.com/full/CS6620826-02A-BIG.jpg",
file: "song/Devil Eyes.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 48,
title: "DNA - Slowed",
artist: "AKON (PHONK REMIX)",
duration: "1:43",
genre: "Phonk",
color: "#5D43E6",
image: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/9a/13/e8/9a13e8e3-93ff-fd84-cbdc-da6b0461fe90/cover.jpg/800x800cc.jpg",
file: "song/DNA - Slowed.mp3",
isDemo: true
},
{
id: 49,
title: "Faded",
artist: "ALAN WALKER",
duration: "3:32",
genre: "Phonk",
color: "#5D43E6",
image: "https://www.songmeaningsandfacts.com/wp-content/uploads/2019/12/Alan-Walker.png",
file: "song/Faded.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 50,
title: "Friendships",
artist: "AKON (PHONK REMIX)",
duration: "4:02",
genre: "Phonk",
color: "#5D43E6",
image: "https://a10.gaanacdn.com/gn_img/albums/dwN39y83DP/N394nGmOKD/size_m.jpg",
file: "song/Friendships.mp3",
isDemo: true
},
{
id: 51,
title: "FUNK ESTRANHO",
artist: "AKON (PHONK REMIX)",
duration: "3:00",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.scdn.co/image/ab67616d0000b273ef943163eed286bfb155885b",
file: "song/FUNK ESTRANHO (SUPER SLOWED REVERB).mp3",
isDemo: true
},
{
id: 52,
title: "Hope",
artist: "AKON (PHONK REMIX)",
duration: "1:50",
genre: "Phonk",
color: "#5D43E6",
image: "https://us-tuna-sounds-images.voicemod.net/7b5bc2b8-a498-4134-be41-d9f810779e10-1715513178629.jpg",
file: "song/Hope.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 53,
title: "i like the way you kiss me",
artist: "AKON (PHONK REMIX)",
duration: "2:22",
genre: "Phonk",
color: "#5D43E6",
image: "https://tse1.mm.bing.net/th/id/OIP.epBAiNpMj6vOAHxJxTK3IAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
file: "song/i like the way you kiss me.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 54,
title: "Infinity",
artist: "AKON (PHONK REMIX)",
duration: "3:37",
genre: "Phonk",
color: "#5D43E6",
image: "https://img.freepik.com/premium-photo/mesmerizing-space-high-quality-ultra-hd-8k-hdr_889056-27040.jpg",
file: "song/Infinity.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 55,
title: "Let Me Down Slowly",
artist: "AKON (PHONK REMIX)",
duration: "2:49",
genre: "Phonk",
color: "#5D43E6",
image: "https://images.nightcafe.studio/jobs/wuoQZCLEeHKMdyF0c4pe/wuoQZCLEeHKMdyF0c4pe--1--y1ts9.jpg?tr=w-1600,c-at_max",
file: "song/Let Me Down Slowly.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 56,
title: "Locura Tectônica",
artist: "AKON (PHONK REMIX)",
duration: "2:00",
genre: "Phonk",
color: "#5D43E6",
image: "https://images.genius.com/eb1788a4d56b6b3d106ffdfc2fba5ea1.1000x1000x1.png",
file: "song/Locura Tectônica (RJ Version) (Super Slowed).mp3",
isDemo: true
},
{
id: 57,
title: "lovely",
artist: "AKON (PHONK REMIX)",
duration: "3:20",
genre: "Phonk",
color: "#5D43E6",
image: "https://tse1.mm.bing.net/th/id/OIP.d_-93MUgU6iqER_SoTFY7gHaKq?rs=1&pid=ImgDetMain&o=7&rm=3",
file: "song/lovely.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 58,
title: "Manasha (Slowed)",
artist: "AKON (PHONK REMIX)",
duration: "2:05",
genre: "Phonk",
color: "#5D43E6",
image: "https://tse2.mm.bing.net/th/id/OIP.e00e5PGmOnmlNHC9SwpPagHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
file: "song/Manasha (Slowed).mp3",
isDemo: true
},
{
id: 59,
title: "MI MAMI FUNK",
artist: "AKON (PHONK REMIX)",
duration: "2:00",
genre: "Phonk",
color: "#5D43E6",
image: "https://images.genius.com/e7fbfe9113482bf0b9167f767b98110e.1000x1000x1.png",
file: "song/MI MAMI FUNK,Vol.2(Super Slowed).mp3",
isDemo: true
},
{
id: 60,
title: "MIDDLE OF THE NIGHT",
artist: "AKON (PHONK REMIX)",
duration: "3:04",
genre: "Phonk",
color: "#5D43E6",
image: "https://is3-ssl.mzstatic.com/image/thumb/Music114/v4/64/03/cb/6403cb43-d892-4663-d759-5093b5ed610c/886448203087.jpg/1200x1200bf-60.jpg",
file: "song/MIDDLE OF THE NIGHT.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 61,
title: "Mockingbird",
artist: "AKON (PHONK REMIX)",
duration: "4:10",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.scdn.co/image/ab67616d0000b273726d48d93d02e1271774f023",
file: "song/Mockingbird.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 62,
title: "MONTAGEM COMA (Slowed)",
artist: "AKON (PHONK REMIX)",
duration: "1:22",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.scdn.co/image/ab67616d0000b2731164d485c1327d039b38ff9f",
file: "song/MONTAGEM COMA (Slowed).mp3",
isDemo: true
},
{
id: 63,
title: "MONTAGEM INVASÃO (Slowed)",
artist: "AKON (PHONK REMIX)",
duration: "1:32",
genre: "Phonk",
color: "#5D43E6",
image: "https://us-tuna-sounds-images.voicemod.net/2ee00e9b-c54f-42f7-8bfd-3a9e46794fd1-1712054259802.png",
file: "song/MONTAGEM INVASÃO (Slowed).mp3",
isDemo: true
},
{
id: 64,
title: "Montagem sombra estelar 1.0",
artist: "AKON (PHONK REMIX)",
duration: "1:26",
genre: "Phonk",
color: "#5D43E6",
image: "https://th.bing.com/th/id/OIP.x_5NT3CPnLlHXyiiVNKLrQHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
file: "song/Montagem sombra estelar 1.0(Slowed + Reverb).mp3",
isDemo: true
},
{
id: 65,
title: "NITRO - Slowed",
artist: "AKON (PHONK REMIX)",
duration: "1:52",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.scdn.co/image/ab67616d0000b273b78a4e42ee2b797af8f36dc1",
file: "song/NITRO - Slowed.mp3",
isDemo: true
},
{
id: 66,
title: "No Lie",
artist: "AKON (PHONK REMIX)",
duration: "3:41",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.scdn.co/image/ab67616d0000b27313f54ffbe6457c912fd82bcb",
file: "song/No Lie.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 67,
title: "NUNCA MUDA (Slowed)",
artist: "AKON (PHONK REMIX)",
duration: "1:30",
genre: "Phonk",
color: "#5D43E6",
image: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9b/76/c9/9b76c9c8-ddc9-34b7-647a-f6f7f0c33f9e/036885210173.png/800x800cc.jpg",
file: "song/NUNCA MUDA_ (Slowed).mp3",
isDemo: true
},
{
id: 68,
title: "Old Town Road",
artist: "AKON (PHONK REMIX)",
duration: "1:53",
genre: "Phonk",
color: "#5D43E6",
image: "https://tse3.mm.bing.net/th/id/OIP.Xva719iI3BV99Wws9rHy9QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
file: "song/Old Town Road.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 69,
title: "Sanson Ki Maala Pe",
artist: "AKON (PHONK REMIX)",
duration: "9:12",
genre: "Phonk",
color: "#5D43E6",
image: "https://tse4.mm.bing.net/th/id/OIP.De30UEUEpRVN-7Emh75WAAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
file: "song/Sanson Ki Maala Pe.mp3",
isDemo: true
},
{
id: 70,
title: "Se Paciente Funk (Slowed)",
artist: "AKON (PHONK REMIX)",
duration: "1:27",
genre: "Phonk",
color: "#5D43E6",
image: "https://lh3.googleusercontent.com/fQRVEW7qwddapvxKkUuOLotcuEjhpsoUnMxBDZeXfs7Cd08Yv7qbKoXOk5vyc-HrgisbFz02c-6t4sOG",
file: "song/Se Paciente Funk (Slowed).mp3",
isDemo: true
},
{
id: 71,
title: "Shameless",
artist: "AKON (PHONK REMIX)",
duration: "3:39",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.scdn.co/image/ab67616d0000b273a6c12cb496b2b49b19660719",
file: "song/Shameless.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 72,
title: "Shape of You",
artist: "AKON (PHONK REMIX)",
duration: "3:53",
genre: "Phonk",
color: "#5D43E6",
image: "https://th.bing.com/th/id/OIP.c2vqk6ifuphliDq_ZYkvdwHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
file: "song/Shape of You.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 73,
title: "SPACE! (Super Slowed)",
artist: "AKON (PHONK REMIX)",
duration: "1:49",
genre: "Phonk",
color: "#5D43E6",
image: "https://img.freepik.com/premium-photo/galaxy-space-background_148391-21042.jpg",
file: "song/SPACE! (Super Slowed).mp3",
isDemo: true
},
{
id: 74,
title: "Starboy",
artist: "AKON (PHONK REMIX)",
duration: "3:50",
genre: "Phonk",
color: "#5D43E6",
image: "https://tse1.mm.bing.net/th/id/OIP.Kw37r_btVb2m3WS7MMeO7wAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
file: "song/Starboy.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 75,
title: "STAY",
artist: "AKON (PHONK REMIX)",
duration: "2:21",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.scdn.co/image/ab67616d0000b273809ac854713e65ce1f4d4bdd",
file: "song/STAY.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 76,
title: "Toota Jo Kabhi Tara",
artist: "AKON (PHONK REMIX)",
duration: "5:50",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.ytimg.com/vi/VtRRgBXZA6k/hqdefault.jpg",
file: "song/Toota Jo Kabhi Tara.mp3",
isDemo: true
},
{
id: 77,
title: "TREINAMENTO DE FORÇA",
artist: "AKON (PHONK REMIX)",
duration: "2:05",
genre: "Phonk",
color: "#5D43E6",
image: "https://th.bing.com/th/id/OIP.oCYwojKOvfFGBLGoaDFaHwHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
file: "song/TREINAMENTO DE FORÇA.mp3",
isDemo: true
},
{
id: 78,
title: "Way down We Go",
artist: "AKON (PHONK REMIX)",
duration: "3:39",
genre: "Phonk",
color: "#5D43E6",
image: "https://tse4.mm.bing.net/th/id/OIP.Ejvzzqnn3gMX4FVtDqIOJQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
file: "song/Way down We Go.mp3",
isDemo: true,
recommended: "Maulik Makwana"
},
{
id: 79,
title: "Woops",
artist: "AKON (PHONK REMIX)",
duration: "4:18",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.scdn.co/image/ab67616d0000b2735ce4a965b0b9195c29422580",
file: "song/Woops.mp3",
isDemo: true
},
{
id: 80,
title: "YOUNG GIRL A FUNK",
artist: "AKON (PHONK REMIX)",
duration: "2:10",
genre: "Phonk",
color: "#5D43E6",
image: "https://lh3.googleusercontent.com/lLh0ptXcfspgIh4nll971yuwJyHrRpgk-hzBXJ5z2WokjNDYjaDZkoX8-6YdJmqqTkY01la-Ja3Dewg",
file: "song/YOUNG GIRL A FUNK (SLOWED TO PERFECTION).mp3",
isDemo: true
},
{
id: 81,
title: "z-beta 2 (Super Slowed)",
artist: "AKON (PHONK REMIX)",
duration: "1:34",
genre: "Phonk",
color: "#5D43E6",
image: "https://i.scdn.co/image/ab67616d0000b2734588a54bf0e6bf7a0e1a5a5f",
file: "song/z-beta 2 (Super Slowed).mp3",
isDemo: true,
recommended: "Aniquen Team"
}
        ];

// Add recommended field to all existing songs if not present
musicLibrary.forEach(song => {
    if (!song.recommended) {
        song.recommended = "Aniquen Team";
    }
    if (!song.playCount) {
        song.playCount = 0;
    }
    if (!song.lastPlayed) {
        song.lastPlayed = null;
    }
});

// ==============================================
// APPLICATION STATE WITH COMPLETE PERSISTENCE
// ==============================================
const state = {
    currentSong: null,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    volume: 0.7,
    currentTime: 0,
    queue: [],
    playHistory: [],
    currentPlaylist: null,
    currentPlaylistSongs: [],
    recentSongs: [],
    topCharts: [],
    songPlayCount: {},
    playlists: [],
    contextMenu: {
        songId: null,
        x: 0,
        y: 0,
        type: null,
        element: null
    },
    currentPage: 'home',
    blobURLs: new Map(),
    imageCache: new Map(),
    restrictedWords: ['kill', 'fuck', 'shit', 'ass', 'bitch', 'damn', 'hell', 'cunt', 'piss', 'dick', 'bastard', 'whore', 'slut']
};

// DOM Elements
const audioPlayer = new Audio();
const homeContent = document.getElementById('home-content');
const playlistsContent = document.getElementById('playlists-content');
const playlistDetail = document.getElementById('playlist-detail');
const allSongsPage = document.getElementById('all-songs-page');
const nowPlayingScreen = document.getElementById('now-playing');
const miniPlayer = document.getElementById('mini-player');
const searchResults = document.getElementById('search-results');
const loadingIndicator = document.getElementById('loading-indicator');
const toast = document.getElementById('toast');
const playlistModal = document.getElementById('playlist-modal');
const songInfoModal = document.getElementById('song-info-modal');
const nowPlayingMenu = document.getElementById('now-playing-menu');

// ==============================================
// UTILITY FUNCTIONS
// ==============================================
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add('active');
    
    if (type === 'error') {
        toast.style.background = 'rgba(255, 107, 107, 0.9)';
    } else if (type === 'success') {
        toast.style.background = 'rgba(0, 229, 168, 0.9)';
    } else if (type === 'warning') {
        toast.style.background = 'rgba(255, 183, 77, 0.9)';
    }
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

function showLoading() {
    loadingIndicator.classList.add('active');
}

function hideLoading() {
    loadingIndicator.classList.remove('active');
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function getRandomColor() {
    const colors = ['#7B61FF', '#00E5A8', '#FF6B9D', '#FFB74D', '#5D43E6', '#9D8AFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function fuzzySearch(query, text) {
    query = query.toLowerCase().replace(/\s+/g, '');
    text = text.toLowerCase().replace(/\s+/g, '');
    
    let queryIndex = 0;
    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
        if (text[i] === query[queryIndex]) {
            queryIndex++;
        }
    }
    return queryIndex === query.length;
}

function isRestrictedName(name) {
    const lowerName = name.toLowerCase();
    return state.restrictedWords.some(word => lowerName.includes(word));
}

function validatePlaylistName(name) {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: "Playlist name cannot be empty" };
    }
    
    if (name.length > 50) {
        return { valid: false, error: "Playlist name is too long (max 50 characters)" };
    }
    
    if (isRestrictedName(name)) {
        return { valid: false, error: "Playlist name contains restricted words" };
    }
    
    const isDuplicate = state.playlists.some(playlist => 
        playlist.name.toLowerCase() === name.toLowerCase()
    );
    
    if (isDuplicate) {
        return { valid: false, error: "A playlist with this name already exists" };
    }
    
    return { valid: true, error: "" };
}

// ==============================================
// IMAGE LOADING OPTIMIZATION
// ==============================================
function loadImageWithCache(url, element) {
    if (!url || !element) return;
    
    if (state.imageCache.has(url)) {
        element.style.backgroundImage = `url(${url})`;
        return;
    }
    
    const img = new Image();
    img.onload = () => {
        state.imageCache.set(url, true);
        element.style.backgroundImage = `url(${url})`;
        element.classList.add('loaded');
    };
    img.onerror = () => {
        console.warn('Failed to load image:', url);
    };
    img.src = url;
}

function preloadImages() {
    const importantImages = [
        'logo.png',
        ...musicLibrary.slice(0, 10).map(song => song.image).filter(Boolean)
    ];
    
    importantImages.forEach(url => {
        if (!state.imageCache.has(url)) {
            const img = new Image();
            img.src = url;
            img.onload = () => state.imageCache.set(url, true);
        }
    });
}

// ==============================================
// INDEXEDDB CONFIGURATION WITH COMPLETE PERSISTENCE
// ==============================================
let db;
const DB_NAME = 'AniquenMusicDB';
const DB_VERSION = 6;

const STORE_NAMES = {
    AUDIO_BLOBS: 'audioBlobs',
    SONG_METADATA: 'songMetadata',
    CACHE: 'musicCache',
    SETTINGS: 'settings',
    PLAYLISTS: 'playlists',
    RECENT_SONGS: 'recentSongs',
    TOP_CHARTS: 'topCharts',
    APP_STATE: 'appState'
};

async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.error);
            reject(event.target.error);
        };
        
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("IndexedDB initialized successfully");
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            console.log("Upgrading IndexedDB database...");
            db = event.target.result;
            
            const stores = [
                STORE_NAMES.AUDIO_BLOBS,
                STORE_NAMES.SONG_METADATA,
                STORE_NAMES.CACHE,
                STORE_NAMES.SETTINGS,
                STORE_NAMES.PLAYLISTS,
                STORE_NAMES.RECENT_SONGS,
                STORE_NAMES.TOP_CHARTS,
                STORE_NAMES.APP_STATE
            ];
            
            stores.forEach(storeName => {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' });
                }
            });
        };
    });
}

// ==============================================
// COMPLETE DATA PERSISTENCE FUNCTIONS
// ==============================================
async function saveAllData() {
    if (!db) return;
    
    try {
        await savePlaylists();
        await saveRecentSongs();
        await saveTopCharts();
        await saveAppState();
        await saveSongPlayCounts();
        console.log('All data saved to IndexedDB');
    } catch (error) {
        console.error('Error saving all data:', error);
    }
}

async function loadAllData() {
    if (!db) return;
    
    try {
        await loadPlaylists();
        await loadRecentSongs();
        await loadTopCharts();
        await loadAppState();
        await loadSongPlayCounts();
        console.log('All data loaded from IndexedDB');
    } catch (error) {
        console.error('Error loading all data:', error);
    }
}

// Save playlists
async function savePlaylists() {
    if (!db) return;
    
    try {
        const transaction = db.transaction([STORE_NAMES.PLAYLISTS], 'readwrite');
        const store = transaction.objectStore(STORE_NAMES.PLAYLISTS);
        await store.clear();
        
        for (const playlist of state.playlists) {
            await store.put(playlist);
        }
    } catch (error) {
        console.error('Error saving playlists:', error);
    }
}

// Load playlists
async function loadPlaylists() {
    if (!db) return;
    
    try {
        const transaction = db.transaction([STORE_NAMES.PLAYLISTS], 'readonly');
        const store = transaction.objectStore(STORE_NAMES.PLAYLISTS);
        const request = store.getAll();
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const playlists = request.result;
                if (playlists && playlists.length > 0) {
                    state.playlists = playlists;
                } else {
                    state.playlists = [
                        { id: 1, name: "Favorites", songs: [1, 2, 3], color: "#FF6B9D" },
                        { id: 2, name: "Workout", songs: [4, 5], color: "#00E5A8" },
                        { id: 3, name: "Chill Vibes", songs: [], color: "#7B61FF" }
                    ];
                    savePlaylists();
                }
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error loading playlists:', error);
    }
}

// Save recent songs
async function saveRecentSongs() {
    if (!db) return;
    
    try {
        const transaction = db.transaction([STORE_NAMES.RECENT_SONGS], 'readwrite');
        const store = transaction.objectStore(STORE_NAMES.RECENT_SONGS);
        await store.clear();
        
        // Save recent songs as an array
        await store.put({
            id: 'recentSongs',
            songs: state.recentSongs,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error saving recent songs:', error);
    }
}

// Load recent songs
async function loadRecentSongs() {
    if (!db) return;
    
    try {
        const transaction = db.transaction([STORE_NAMES.RECENT_SONGS], 'readonly');
        const store = transaction.objectStore(STORE_NAMES.RECENT_SONGS);
        const request = store.get('recentSongs');
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const data = request.result;
                if (data && data.songs && data.songs.length > 0) {
                    state.recentSongs = data.songs;
                } else {
                    state.recentSongs = [1, 2, 3, 4, 5];
                    saveRecentSongs();
                }
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error loading recent songs:', error);
    }
}

// Save top charts
async function saveTopCharts() {
    if (!db) return;
    
    try {
        // Calculate top charts from play counts
        const sortedSongs = [...musicLibrary]
            .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
            .slice(0, 20)
            .map(song => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                playCount: song.playCount || 0,
                lastPlayed: song.lastPlayed
            }));
        
        const transaction = db.transaction([STORE_NAMES.TOP_CHARTS], 'readwrite');
        const store = transaction.objectStore(STORE_NAMES.TOP_CHARTS);
        await store.clear();
        
        await store.put({
            id: 'topCharts',
            charts: sortedSongs,
            lastUpdated: new Date().toISOString()
        });
        
        state.topCharts = sortedSongs;
    } catch (error) {
        console.error('Error saving top charts:', error);
    }
}

// Load top charts
async function loadTopCharts() {
    if (!db) return;
    
    try {
        const transaction = db.transaction([STORE_NAMES.TOP_CHARTS], 'readonly');
        const store = transaction.objectStore(STORE_NAMES.TOP_CHARTS);
        const request = store.get('topCharts');
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const data = request.result;
                if (data && data.charts && data.charts.length > 0) {
                    state.topCharts = data.charts;
                    // Update music library with loaded play counts
                    data.charts.forEach(chart => {
                        const song = musicLibrary.find(s => s.id === chart.id);
                        if (song) {
                            song.playCount = chart.playCount;
                            song.lastPlayed = chart.lastPlayed;
                        }
                    });
                }
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error loading top charts:', error);
    }
}

// Save app state (shuffle, repeat, volume, current song)
async function saveAppState() {
    if (!db) return;
    
    try {
        const transaction = db.transaction([STORE_NAMES.APP_STATE], 'readwrite');
        const store = transaction.objectStore(STORE_NAMES.APP_STATE);
        
        const appState = {
            id: 'appState',
            isShuffle: state.isShuffle,
            isRepeat: state.isRepeat,
            volume: state.volume,
            currentSong: state.currentSong,
            currentTime: audioPlayer.currentTime,
            queue: state.queue,
            playHistory: state.playHistory,
            lastUpdated: new Date().toISOString()
        };
        
        await store.put(appState);
    } catch (error) {
        console.error('Error saving app state:', error);
    }
}

// Load app state
async function loadAppState() {
    if (!db) return;
    
    try {
        const transaction = db.transaction([STORE_NAMES.APP_STATE], 'readonly');
        const store = transaction.objectStore(STORE_NAMES.APP_STATE);
        const request = store.get('appState');
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const data = request.result;
                if (data) {
                    state.isShuffle = data.isShuffle || false;
                    state.isRepeat = data.isRepeat || false;
                    state.volume = data.volume || 0.7;
                    state.currentSong = data.currentSong || null;
                    state.queue = data.queue || [];
                    state.playHistory = data.playHistory || [];
                    
                    // Set audio player properties
                    audioPlayer.volume = state.volume;
                    document.getElementById('volume-slider').value = state.volume * 100;
                    
                    if (data.currentTime) {
                        audioPlayer.currentTime = data.currentTime;
                    }
                    
                    // Update UI buttons
                    updatePlayButtons();
                }
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error loading app state:', error);
    }
}

// Save individual song play counts
async function saveSongPlayCounts() {
    if (!db) return;
    
    try {
        const transaction = db.transaction([STORE_NAMES.CACHE], 'readwrite');
        const store = transaction.objectStore(STORE_NAMES.CACHE);
        
        for (const song of musicLibrary) {
            if (song.playCount > 0 || song.lastPlayed) {
                await store.put({
                    id: song.id,
                    playCount: song.playCount || 0,
                    lastPlayed: song.lastPlayed,
                    title: song.title,
                    artist: song.artist
                });
            }
        }
    } catch (error) {
        console.error('Error saving song play counts:', error);
    }
}

// Load individual song play counts
async function loadSongPlayCounts() {
    if (!db) return;
    
    try {
        const transaction = db.transaction([STORE_NAMES.CACHE], 'readonly');
        const store = transaction.objectStore(STORE_NAMES.CACHE);
        const request = store.getAll();
        
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const cachedSongs = event.target.result;
                cachedSongs.forEach(cached => {
                    const song = musicLibrary.find(s => s.id === cached.id);
                    if (song) {
                        song.playCount = cached.playCount || 0;
                        song.lastPlayed = cached.lastPlayed;
                    }
                });
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error loading song play counts:', error);
    }
}

// Clear recent songs
async function clearRecentSongs() {
    state.recentSongs = [];
    await saveRecentSongs();
    updateRecentSongs();
    showToast('Recent songs cleared', 'success');
}

// Remove song from recent
async function removeSongFromRecent(songId) {
    state.recentSongs = state.recentSongs.filter(id => id !== songId);
    await saveRecentSongs();
    updateRecentSongs();
    showToast('Song removed from recent', 'success');
}

// ==============================================
// NAVIGATION FUNCTIONS
// ==============================================
function showPage(page) {
    homeContent.style.display = 'none';
    playlistsContent.classList.remove('active');
    playlistDetail.classList.remove('active');
    allSongsPage.classList.remove('active');
    nowPlayingScreen.classList.remove('active');
    
    state.currentPage = page;
    
    switch(page) {
        case 'home':
            homeContent.style.display = 'block';
            break;
        case 'playlists':
            playlistsContent.classList.add('active');
            break;
        case 'playlist-detail':
            playlistDetail.classList.add('active');
            break;
        case 'all-songs':
            allSongsPage.classList.add('active');
            break;
        case 'now-playing':
            nowPlayingScreen.classList.add('active');
            break;
    }
    
    updateNavIcons(page === 'playlists' ? 'playlists' : 'home');
}

function updateNavIcons(active) {
    document.querySelectorAll('.nav-icons i').forEach(icon => {
        icon.classList.remove('active');
    });
    if (document.getElementById(`nav-${active}`)) {
        document.getElementById(`nav-${active}`).classList.add('active');
    }
}

// ==============================================
// SMART SEARCH FUNCTIONALITY
// ==============================================
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', debounce(handleSearch, 300));

searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) {
        searchResults.classList.add('active');
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        searchResults.classList.remove('active');
    }
});

function handleSearch(e) {
    const query = e.target.value.trim();
    
    if (query.length === 0) {
        searchResults.classList.remove('active');
        return;
    }
    
    const filteredSongs = musicLibrary.filter(song => {
        const searchableText = `${song.title} ${song.artist} ${song.genre} ${song.recommended}`.toLowerCase();
        const queryLower = query.toLowerCase();
        
        // Exact match
        if (searchableText.includes(queryLower)) {
            return true;
        }
        
        // Fuzzy match
        if (fuzzySearch(query, song.title) || 
            fuzzySearch(query, song.artist) || 
            fuzzySearch(query, song.genre) ||
            fuzzySearch(query, song.recommended)) {
            return true;
        }
        
        // Keyword match
        const keywords = queryLower.split(' ');
        return keywords.every(keyword => searchableText.includes(keyword));
    });
    
    updateSearchResults(filteredSongs);
    searchResults.classList.add('active');
}

function updateSearchResults(songs) {
    searchResults.innerHTML = '';
    
    if (songs.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <div>No songs found</div>
                <div style="font-size: 12px; margin-top: 8px;">Try different keywords</div>
            </div>
        `;
        return;
    }
    
    songs.forEach(song => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <div class="search-result-img">
                ${song.image ? `<img src="${song.image}" alt="${song.title}" loading="lazy">` : '<i class="fas fa-music"></i>'}
            </div>
            <div class="search-result-info">
                <div class="search-result-title">${song.title}</div>
                <div class="search-result-artist">${song.artist} • ${song.genre}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
        `;
        resultItem.addEventListener('click', () => {
            playSong(song.id);
            searchResults.classList.remove('active');
            searchInput.value = '';
        });
        resultItem.addEventListener('contextmenu', (e) => showContextMenu(e, song.id));
        searchResults.appendChild(resultItem);
    });
}

// ==============================================
// UI UPDATE FUNCTIONS WITH RECENT OPTIONS
// ==============================================
function updateUI() {
    updateRecentSongs();
    updateMostPlayed();
    updateAllSongs();
    updatePlaylists();
}

function updateRecentSongs() {
    const recentContainer = document.getElementById('recent-songs');
    recentContainer.innerHTML = '';
    
    // Add clear all button to section header
    const sectionHeader = recentContainer.closest('.section').querySelector('.section-header');
    if (!sectionHeader.querySelector('.clear-recent-btn')) {
        const clearBtn = document.createElement('div');
        clearBtn.className = 'see-all clear-recent-btn';
        clearBtn.innerHTML = '<i class="fas fa-trash"></i> Clear All';
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.recentSongs.length > 0) {
                if (confirm('Clear all recent songs?')) {
                    clearRecentSongs();
                }
            }
        });
        sectionHeader.appendChild(clearBtn);
    }
    
    const recentSongIds = state.recentSongs.length > 0 ? state.recentSongs : [1, 2, 3, 4, 5];
    
    recentSongIds.forEach(songId => {
        const song = musicLibrary.find(s => s.id === songId);
        if (song) {
            const card = createSongCard(song);
            // Add context menu to recent song cards
            card.addEventListener('contextmenu', (e) => showRecentSongContextMenu(e, song.id));
            recentContainer.appendChild(card);
        }
    });
}

function updateMostPlayed() {
    const mostPlayedContainer = document.getElementById('most-played');
    mostPlayedContainer.innerHTML = '';
    
    const sortedSongs = [...musicLibrary]
        .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
        .slice(0, 6);
    
    sortedSongs.forEach((song, index) => {
        const card = createSongCard(song);
        if (index < 3) {
            const badge = document.createElement('div');
            badge.className = 'card-badge';
            badge.textContent = `#${index + 1}`;
            card.querySelector('.card-img').appendChild(badge);
        }
        card.addEventListener('contextmenu', (e) => showContextMenu(e, song.id));
        mostPlayedContainer.appendChild(card);
    });
}

function updateAllSongs() {
    const allSongsContainer = document.getElementById('all-songs');
    allSongsContainer.innerHTML = '';
    
    const displaySongs = musicLibrary.slice(0, 10);
    
    displaySongs.forEach((song, index) => {
        allSongsContainer.appendChild(createSongItem(song, index));
    });
}

function createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'scroll-card card';
    card.innerHTML = `
        <div class="card-img">
            ${song.image ? `<img src="${song.image}" alt="${song.title}" loading="lazy">` : '<i class="fas fa-music"></i>'}
        </div>
        <div class="card-content">
            <div class="card-title">${song.title}</div>
            <div class="card-subtitle">${song.artist}</div>
        </div>
    `;
    card.addEventListener('click', (e) => handleSongClick(song.id, e));
    return card;
}

function createSongItem(song, index, isInPlaylist = false) {
    const songItem = document.createElement('div');
    songItem.className = `song-item ${state.currentSong === song.id ? 'active' : ''} ${state.currentSong === song.id && state.isPlaying ? 'playing' : ''} ${isInPlaylist ? 'in-playlist' : ''}`;
    songItem.innerHTML = `
        <div class="song-img">
            ${song.image ? `<img src="${song.image}" alt="${song.title}" loading="lazy">` : '<i class="fas fa-music"></i>'}
        </div>
        <div class="song-info">
            <div class="song-name">${song.title}</div>
            <div class="song-artist">${song.artist} • ${song.genre}</div>
        </div>
        <div class="song-duration">${song.duration}</div>
        <div class="song-delete-btn" data-song-id="${song.id}">
            <i class="fas fa-trash-alt"></i>
        </div>
    `;
    
    songItem.addEventListener('click', (e) => {
        if (!e.target.closest('.song-delete-btn')) {
            handleSongClick(song.id, e);
        }
    });
    
    songItem.addEventListener('contextmenu', (e) => showContextMenu(e, song.id));
    
    const deleteBtn = songItem.querySelector('.song-delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSongFromPlaylist(song.id);
    });
    
    return songItem;
}

// ==============================================
// PLAYLIST MANAGEMENT
// ==============================================
function updatePlaylists() {
    const playlistsGrid = document.getElementById('playlists-grid');
    playlistsGrid.innerHTML = '';
    
    state.playlists.forEach(playlist => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img" style="background: linear-gradient(135deg, ${playlist.color}, var(--dark-card))">
                <i class="fas fa-list-music"></i>
            </div>
            <div class="card-content">
                <div class="card-title">${playlist.name}</div>
                <div class="card-subtitle">${playlist.songs.length} songs</div>
            </div>
        `;
        card.addEventListener('click', () => openPlaylistDetail(playlist.id));
        card.addEventListener('contextmenu', (e) => showPlaylistContextMenu(e, playlist.id));
        playlistsGrid.appendChild(card);
    });
}

function openPlaylistDetail(playlistId) {
    const playlist = state.playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    state.currentPlaylist = playlistId;
    state.currentPlaylistSongs = [...playlist.songs];
    
    document.getElementById('playlist-detail-title').textContent = playlist.name;
    document.getElementById('playlist-detail-subtitle').textContent = `${playlist.songs.length} songs`;
    
    const playlistSongsContainer = document.getElementById('playlist-detail-songs');
    playlistSongsContainer.innerHTML = '';
    
    if (playlist.songs.length === 0) {
        playlistSongsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-music" style="font-size: 48px; margin-bottom: 20px;"></i>
                <div style="font-size: 18px; font-weight: 600;">No songs in this playlist</div>
                <div style="margin-top: 10px;">Add songs using the context menu</div>
            </div>
        `;
    } else {
        playlist.songs.forEach(songId => {
            const song = musicLibrary.find(s => s.id === songId);
            if (song) {
                playlistSongsContainer.appendChild(createSongItem(song, playlist.songs.indexOf(songId), true));
            }
        });
    }
    
    showPage('playlist-detail');
}

function deleteSongFromPlaylist(songId) {
    if (!state.currentPlaylist) return;
    
    const playlist = state.playlists.find(p => p.id === state.currentPlaylist);
    if (!playlist) return;
    
    const songIndex = playlist.songs.indexOf(songId);
    if (songIndex === -1) return;
    
    playlist.songs.splice(songIndex, 1);
    savePlaylists();
    openPlaylistDetail(state.currentPlaylist);
    showToast('Song removed from playlist', 'success');
}

function showPlaylistContextMenu(e, playlistId) {
    e.preventDefault();
    e.stopPropagation();
    
    const menu = document.getElementById('playlist-options-menu');
    menu.style.left = `${Math.min(e.clientX, window.innerWidth - 220)}px`;
    menu.style.top = `${Math.min(e.clientY, window.innerHeight - 150)}px`;
    menu.classList.add('active');
    
    state.contextMenu.playlistId = playlistId;
    
    setTimeout(() => {
        document.addEventListener('click', closePlaylistContextMenu);
    }, 10);
}

function closePlaylistContextMenu() {
    const menu = document.getElementById('playlist-options-menu');
    menu.classList.remove('active');
    document.removeEventListener('click', closePlaylistContextMenu);
}

// ==============================================
// PLAYLIST MODAL FUNCTIONS
// ==============================================
function showPlaylistModal(playlistId = null) {
    const modal = document.getElementById('playlist-modal');
    const title = document.getElementById('modal-title');
    const nameInput = document.getElementById('playlist-name-input');
    const error = document.getElementById('modal-error');
    const saveBtn = document.getElementById('modal-save');
    
    error.classList.remove('active');
    error.textContent = '';
    
    if (playlistId) {
        // Edit mode
        const playlist = state.playlists.find(p => p.id === playlistId);
        if (!playlist) return;
        
        title.textContent = 'Edit Playlist';
        nameInput.value = playlist.name;
        state.contextMenu.playlistId = playlistId;
        saveBtn.textContent = 'Update';
    } else {
        // Create mode
        title.textContent = 'Create Playlist';
        nameInput.value = '';
        state.contextMenu.playlistId = null;
        saveBtn.textContent = 'Create';
    }
    
    modal.classList.add('active');
}

function closePlaylistModal() {
    playlistModal.classList.remove('active');
}

// ==============================================
// SONG INFO MODAL
// ==============================================
function showSongInfoModal(songId) {
    const song = musicLibrary.find(s => s.id === songId);
    if (!song) return;
    
    // Find which playlists contain this song
    const containingPlaylists = state.playlists.filter(playlist => 
        playlist.songs.includes(songId)
    ).map(playlist => playlist.name);
    
    document.getElementById('info-song-title').textContent = song.title;
    document.getElementById('info-song-artist').textContent = `Artist: ${song.artist}`;
    document.getElementById('info-song-genre').textContent = `Genre: ${song.genre}`;
    document.getElementById('info-song-duration').textContent = `Duration: ${song.duration}`;
    document.getElementById('info-song-plays').textContent = `Plays: ${song.playCount || 0}`;
    document.getElementById('info-song-recommended').textContent = `Recommended by: ${song.recommended || 'Unknown'}`;
    document.getElementById('info-song-playlists').textContent = `In playlists: ${containingPlaylists.length > 0 ? containingPlaylists.join(', ') : 'None'}`;
    
    const imageContainer = document.getElementById('info-song-image');
    if (song.image) {
        imageContainer.innerHTML = `<img src="${song.image}" alt="${song.title}" loading="lazy">`;
    } else {
        imageContainer.innerHTML = '<i class="fas fa-music"></i>';
    }
    
    songInfoModal.classList.add('active');
}

function closeSongInfoModal() {
    songInfoModal.classList.remove('active');
}

// ==============================================
// MUSIC PLAYER FUNCTIONS WITH PERSISTENCE
// ==============================================
function playSong(songId) {
    const song = musicLibrary.find(s => s.id === songId);
    if (!song) return;
    
    if (state.currentSong !== null) {
        state.playHistory.push(state.currentSong);
    }
    
    state.currentSong = songId;
    
    document.getElementById('banner-song-title').textContent = `${song.title} • ${song.artist}`;
    
    audioPlayer.src = song.file;
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    state.isPlaying = true;
    
    updateNowPlayingInfo();
    updatePlayButtons();
    updateMiniPlayer();
    updateMediaSession(song);
    
    miniPlayer.classList.remove('hidden');
    
    cacheSongPlay(songId);
    
    if (!state.recentSongs.includes(songId)) {
        state.recentSongs.unshift(songId);
        state.recentSongs = state.recentSongs.slice(0, 10);
        saveRecentSongs();
    }
    
    // Update top charts
    saveTopCharts();
    
    updateUI();
}

function updateNowPlayingInfo() {
    const song = musicLibrary.find(s => s.id === state.currentSong);
    if (!song) return;
    
    document.getElementById('now-playing-title').textContent = song.title;
    document.getElementById('now-playing-artist').textContent = song.artist;
    document.getElementById('now-playing-recommended').textContent = `Recommended by: ${song.recommended || 'Unknown'}`;
    document.getElementById('mini-player-title').textContent = song.title;
    document.getElementById('mini-player-artist').textContent = song.artist;
    
    // Update full background image
    const bg = document.getElementById('now-playing-bg');
    if (song.image) {
        loadImageWithCache(song.image, bg);
    } else {
        bg.style.backgroundImage = 'none';
    }
    
    // Update album art
    const albumArt = document.getElementById('album-art');
    if (song.image) {
        albumArt.innerHTML = `<img src="${song.image}" alt="${song.title}" loading="lazy">`;
    } else {
        albumArt.innerHTML = '<i class="fas fa-music"></i>';
        albumArt.style.background = `linear-gradient(135deg, ${song.color || getRandomColor()}, ${getRandomColor()})`;
    }
    
    if (state.isPlaying) {
        albumArt.classList.add('playing');
    } else {
        albumArt.classList.remove('playing');
    }
    
    // Show which playlists contain this song
    const containingPlaylists = state.playlists.filter(playlist => 
        playlist.songs.includes(song.id)
    ).map(playlist => playlist.name);
    
    const playlistInfo = document.getElementById('song-playlist-info');
    if (containingPlaylists.length > 0) {
        playlistInfo.textContent = `In playlists: ${containingPlaylists.join(', ')}`;
    } else {
        playlistInfo.textContent = '';
    }
}

function updatePlayButtons() {
    const playIcon = state.isPlaying ? 'fa-pause' : 'fa-play';
    document.getElementById('play-pause-btn').innerHTML = `<i class="fas ${playIcon}"></i>`;
    document.getElementById('mini-play-btn').innerHTML = `<i class="fas ${playIcon}"></i>`;
    
    // Update shuffle and repeat buttons - only one can be active
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    
    if (state.isShuffle) {
        shuffleBtn.classList.add('active');
        repeatBtn.classList.remove('active');
        state.isRepeat = false;
    } else if (state.isRepeat) {
        repeatBtn.classList.add('active');
        shuffleBtn.classList.remove('active');
        state.isShuffle = false;
    } else {
        shuffleBtn.classList.remove('active');
        repeatBtn.classList.remove('active');
    }
    
    // Save state
    saveAppState();
}

function updateMiniPlayer() {
    const miniImg = document.getElementById('mini-player-img');
    const song = musicLibrary.find(s => s.id === state.currentSong);
    
    if (song) {
        if (song.image) {
            miniImg.innerHTML = `<img src="${song.image}" alt="${song.title}" loading="lazy">`;
        } else {
            miniImg.innerHTML = '<i class="fas fa-music"></i>';
            miniImg.style.background = `linear-gradient(135deg, ${song.color || getRandomColor()}, ${getRandomColor()})`;
        }
    }
}

// ==============================================
// PLAYER CONTROLS
// ==============================================
function togglePlayPause() {
    if (state.currentSong) {
        if (state.isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        state.isPlaying = !state.isPlaying;
        updatePlayButtons();
        
        const albumArt = document.getElementById('album-art');
        if (state.isPlaying) {
            albumArt.classList.add('playing');
        } else {
            albumArt.classList.remove('playing');
        }
        
        // Save state
        saveAppState();
    } else if (musicLibrary.length > 0) {
        playSong(musicLibrary[0].id);
    }
}

function playNextSong() {
    if (!state.currentSong) return;
    
    if (state.queue.length > 0) {
        const nextSongId = state.queue.shift();
        playSong(nextSongId);
        return;
    }
    
    if (state.currentPlaylist && state.currentPlaylistSongs.length > 0) {
        let currentIndex = state.currentPlaylistSongs.indexOf(state.currentSong);
        let nextIndex;
        
        if (state.isShuffle) {
            do {
                nextIndex = Math.floor(Math.random() * state.currentPlaylistSongs.length);
            } while (nextIndex === currentIndex && state.currentPlaylistSongs.length > 1);
        } else {
            nextIndex = (currentIndex + 1) % state.currentPlaylistSongs.length;
        }
        
        playSong(state.currentPlaylistSongs[nextIndex]);
        return;
    }
    
    let currentIndex = musicLibrary.findIndex(s => s.id === state.currentSong);
    let nextIndex;
    
    if (state.isShuffle) {
        do {
            nextIndex = Math.floor(Math.random() * musicLibrary.length);
        } while (nextIndex === currentIndex && musicLibrary.length > 1);
    } else {
        nextIndex = (currentIndex + 1) % musicLibrary.length;
    }
    
    playSong(musicLibrary[nextIndex].id);
}

function playPreviousSong() {
    if (!state.currentSong) return;
    
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
        return;
    }
    
    if (state.playHistory.length > 0) {
        const prevSongId = state.playHistory.pop();
        playSong(prevSongId);
    } else {
        if (state.currentPlaylist && state.currentPlaylistSongs.length > 0) {
            let currentIndex = state.currentPlaylistSongs.indexOf(state.currentSong);
            let prevIndex = (currentIndex - 1 + state.currentPlaylistSongs.length) % state.currentPlaylistSongs.length;
            playSong(state.currentPlaylistSongs[prevIndex]);
        } else {
            let currentIndex = musicLibrary.findIndex(s => s.id === state.currentSong);
            let prevIndex = (currentIndex - 1 + musicLibrary.length) % musicLibrary.length;
            playSong(musicLibrary[prevIndex].id);
        }
    }
}

function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    if (state.isShuffle) {
        state.isRepeat = false;
    }
    updatePlayButtons();
    showToast(state.isShuffle ? 'Shuffle enabled' : 'Shuffle disabled');
    
    // Save state
    saveAppState();
}

function toggleRepeat() {
    state.isRepeat = !state.isRepeat;
    if (state.isRepeat) {
        state.isShuffle = false;
    }
    updatePlayButtons();
    showToast(state.isRepeat ? 'Repeat enabled' : 'Repeat disabled');
    
    // Save state
    saveAppState();
}

// ==============================================
// PROGRESS BAR WITH ENHANCED DRAGGING
// ==============================================
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');

let isDragging = false;

progressBar.addEventListener('click', (e) => {
    if (isDragging) return;
    const rect = progressBar.getBoundingClientRect();
    const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

progressBar.addEventListener('mousedown', startDragging);
progressBar.addEventListener('touchstart', startDragging);

function startDragging(e) {
    e.preventDefault();
    isDragging = true;
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
    handleDrag(e);
}

function handleDrag(e) {
    if (!isDragging || !audioPlayer.duration) return;
    
    const rect = progressBar.getBoundingClientRect();
    let clientX;
    
    if (e.type.includes('touch')) {
        clientX = e.touches[0].clientX;
    } else {
        clientX = e.clientX;
    }
    
    const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    progress.style.width = `${percent * 100}%`;
}

function stopDragging() {
    if (!isDragging || !audioPlayer.duration) return;
    
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('mouseup', stopDragging);
    document.removeEventListener('touchend', stopDragging);
    
    const rect = progressBar.getBoundingClientRect();
    const percent = parseFloat(progress.style.width) / 100;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

audioPlayer.addEventListener('timeupdate', () => {
    if (!isDragging && audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = `${percent}%`;
        
        document.getElementById('current-time').textContent = formatTime(audioPlayer.currentTime);
        document.getElementById('total-time').textContent = formatTime(audioPlayer.duration);
        
        state.currentTime = audioPlayer.currentTime;
        
        // Auto-save current time every 5 seconds
        if (Math.floor(audioPlayer.currentTime) % 5 === 0) {
            saveAppState();
        }
    }
});

audioPlayer.addEventListener('ended', () => {
    if (state.isRepeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        playNextSong();
    }
});

// ==============================================
// VOLUME CONTROL WITH PERSISTENCE
// ==============================================
const volumeSlider = document.getElementById('volume-slider');
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audioPlayer.volume = volume;
    state.volume = volume;
    saveAppState();
});

// ==============================================
// CONTEXT MENU FUNCTIONS (NOW PLAYING MENU FIXED)
// ==============================================
function showContextMenu(e, songId) {
    e.preventDefault();
    e.stopPropagation();
    
    state.contextMenu.songId = songId;
    state.contextMenu.x = e.clientX;
    state.contextMenu.y = e.clientY;
    state.contextMenu.type = 'song';
    
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.left = `${Math.min(e.clientX, window.innerWidth - 220)}px`;
    contextMenu.style.top = `${Math.min(e.clientY, window.innerHeight - 300)}px`;
    contextMenu.classList.add('active');
    
    // Show/hide delete button based on context
    const deleteBtn = document.getElementById('context-delete-song');
    const removeBtn = document.getElementById('context-remove-playlist');
    
    if (state.currentPlaylist) {
        deleteBtn.style.display = 'none';
        removeBtn.style.display = 'flex';
    } else {
        deleteBtn.style.display = 'flex';
        removeBtn.style.display = 'none';
    }
    
    setTimeout(() => {
        document.addEventListener('click', closeContextMenu);
    }, 10);
}

function showRecentSongContextMenu(e, songId) {
    e.preventDefault();
    e.stopPropagation();
    
    state.contextMenu.songId = songId;
    state.contextMenu.x = e.clientX;
    state.contextMenu.y = e.clientY;
    state.contextMenu.type = 'recent-song';
    
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.left = `${Math.min(e.clientX, window.innerWidth - 220)}px`;
    contextMenu.style.top = `${Math.min(e.clientY, window.innerHeight - 300)}px`;
    contextMenu.classList.add('active');
    
    // Show remove from recent option
    const deleteBtn = document.getElementById('context-delete-song');
    const removeBtn = document.getElementById('context-remove-playlist');
    
    deleteBtn.style.display = 'none';
    removeBtn.style.display = 'flex';
    removeBtn.innerHTML = '<i class="fas fa-history"></i><span>Remove from Recent</span>';
    
    // Store original onclick
    const originalOnClick = removeBtn.onclick;
    removeBtn.onclick = function() {
        removeSongFromRecent(songId);
        closeContextMenu();
    };
    
    // Restore original onclick after menu closes
    setTimeout(() => {
        document.addEventListener('click', () => {
            removeBtn.onclick = originalOnClick;
            removeBtn.innerHTML = '<i class="fas fa-trash"></i><span>Remove from Playlist</span>';
        }, { once: true });
    }, 10);
    
    setTimeout(() => {
        document.addEventListener('click', closeContextMenu);
    }, 10);
}

function showNowPlayingContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!state.currentSong) {
        showToast('No song is currently playing', 'warning');
        return;
    }
    
    state.contextMenu.songId = state.currentSong;
    state.contextMenu.x = e.clientX;
    state.contextMenu.y = e.clientY;
    state.contextMenu.type = 'now-playing';
    
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.left = `${Math.min(e.clientX, window.innerWidth - 220)}px`;
    contextMenu.style.top = `${Math.min(e.clientY, window.innerHeight - 300)}px`;
    contextMenu.classList.add('active');
    
    // Show/hide delete button based on context
    const deleteBtn = document.getElementById('context-delete-song');
    const removeBtn = document.getElementById('context-remove-playlist');
    
    if (state.currentPlaylist) {
        deleteBtn.style.display = 'none';
        removeBtn.style.display = 'flex';
    } else {
        deleteBtn.style.display = 'flex';
        removeBtn.style.display = 'none';
    }
    
    setTimeout(() => {
        document.addEventListener('click', closeContextMenu);
    }, 10);
}

function closeContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    contextMenu.classList.remove('active');
    document.removeEventListener('click', closeContextMenu);
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================
function cacheSongPlay(songId) {
    const song = musicLibrary.find(s => s.id === songId);
    if (!song) return;
    
    song.playCount = (song.playCount || 0) + 1;
    song.lastPlayed = new Date().toISOString();
    
    // Save to IndexedDB
    saveSongPlayCounts();
    saveTopCharts();
}

function addSongToPlaylist(songId, playlistName) {
    let playlist = state.playlists.find(p => p.name.toLowerCase() === playlistName.toLowerCase());
    
    if (!playlist) {
        playlist = {
            id: Date.now(),
            name: playlistName,
            songs: [songId],
            color: getRandomColor()
        };
        state.playlists.push(playlist);
        showToast(`Created new playlist "${playlistName}"`, 'success');
    } else if (!playlist.songs.includes(songId)) {
        playlist.songs.push(songId);
        showToast(`Added to "${playlistName}"`, 'success');
    } else {
        showToast('Song already in playlist', 'warning');
        return;
    }
    
    savePlaylists();
    updatePlaylists();
}

function deletePlaylist(playlistId) {
    if (!playlistId) return;
    
    const playlist = state.playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    if (confirm(`Are you sure you want to delete playlist "${playlist.name}"?`)) {
        state.playlists = state.playlists.filter(p => p.id !== playlistId);
        savePlaylists();
        updatePlaylists();
        
        if (state.currentPlaylist === playlistId) {
            showPage('playlists');
        }
        
        showToast('Playlist deleted', 'success');
    }
}

function shuffleAllSongs() {
    if (musicLibrary.length === 0) return;
    
    state.isShuffle = true;
    state.isRepeat = false;
    updatePlayButtons();
    
    const randomIndex = Math.floor(Math.random() * musicLibrary.length);
    playSong(musicLibrary[randomIndex].id);
}

function addToQueue(songId) {
    if (!state.queue.includes(songId)) {
        state.queue.push(songId);
        showToast('Added to queue', 'success');
        saveAppState();
    }
}

function playNext(songId) {
    state.queue.unshift(songId);
    showToast('Song will play next', 'success');
    saveAppState();
}

function openAllSongsPage(title, songs) {
    document.getElementById('all-songs-title').textContent = title;
    const allSongsList = document.getElementById('all-songs-list');
    allSongsList.innerHTML = '';
    
    state.currentPlaylist = null;
    state.currentPlaylistSongs = [];
    
    songs.forEach((song, index) => {
        allSongsList.appendChild(createSongItem(song, index));
    });
    
    showPage('all-songs');
}

function handleSongClick(songId, e) {
    if (state.currentSong === songId) {
        togglePlayPause();
        if (!state.isPlaying) {
            nowPlayingScreen.classList.add('active');
        }
    } else {
        playSong(songId);
    }
}

function updateMediaSession(song) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: song.genre,
            artwork: song.image ? [
                { src: song.image, sizes: '512x512', type: 'image/jpeg' }
            ] : []
        });
        
        // Add action handlers
        navigator.mediaSession.setActionHandler('play', togglePlayPause);
        navigator.mediaSession.setActionHandler('pause', togglePlayPause);
        navigator.mediaSession.setActionHandler('nexttrack', playNextSong);
        navigator.mediaSession.setActionHandler('previoustrack', playPreviousSong);
    }
}

// ==============================================
// EVENT LISTENERS SETUP (FIXED NOW PLAYING MENU)
// ==============================================
function setupEventListeners() {
    // Navigation
    document.getElementById('nav-home').addEventListener('click', () => showPage('home'));
    document.getElementById('nav-playlists').addEventListener('click', () => showPage('playlists'));
    document.getElementById('playlist-detail-back').addEventListener('click', () => showPage('playlists'));
    document.getElementById('all-songs-back').addEventListener('click', () => showPage('home'));
    document.getElementById('now-playing-back').addEventListener('click', () => nowPlayingScreen.classList.remove('active'));
    
    // Player controls
    document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
    document.getElementById('mini-play-btn').addEventListener('click', togglePlayPause);
    document.getElementById('next-btn').addEventListener('click', playNextSong);
    document.getElementById('mini-next-btn').addEventListener('click', playNextSong);
    document.getElementById('prev-btn').addEventListener('click', playPreviousSong);
    document.getElementById('mini-prev-btn').addEventListener('click', playPreviousSong);
    document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
    document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);
    
    // Now Playing menu button (FIXED)
    nowPlayingMenu.addEventListener('click', (e) => {
        showNowPlayingContextMenu(e);
    });
    
    // Mini player
    miniPlayer.addEventListener('click', () => {
        nowPlayingScreen.classList.add('active');
    });
    
    // View All buttons
    document.getElementById('view-recent').addEventListener('click', () => {
        const recentSongs = state.recentSongs.map(id => musicLibrary.find(s => s.id === id)).filter(Boolean);
        openAllSongsPage('Recently Played', recentSongs);
    });
    
    document.getElementById('view-charts').addEventListener('click', () => {
        const topSongs = [...musicLibrary].sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
        openAllSongsPage('Top Charts', topSongs);
    });
    
    document.getElementById('view-library').addEventListener('click', () => {
        openAllSongsPage('All Songs', musicLibrary);
    });
    
    // Playlist actions
    document.getElementById('create-playlist').addEventListener('click', () => showPlaylistModal());
    document.getElementById('shuffle-playlist').addEventListener('click', shuffleAllSongs);
    
    // Playlist options
    document.getElementById('playlist-options').addEventListener('click', (e) => {
        showPlaylistContextMenu(e, null);
    });
    
    document.getElementById('playlist-detail-options').addEventListener('click', (e) => {
        showPlaylistContextMenu(e, state.currentPlaylist);
    });
    
    // Context menu items
    document.getElementById('context-song-info').addEventListener('click', () => {
        showSongInfoModal(state.contextMenu.songId);
        closeContextMenu();
    });
    
    document.getElementById('context-add-playlist').addEventListener('click', () => {
        const songId = state.contextMenu.songId;
        if (!songId) return;
        
        const playlistNames = state.playlists.map(p => p.name);
        let playlistChoice = prompt(`Add to playlist:\n${playlistNames.join('\n')}\n\nEnter playlist name or create new:`);
        
        if (playlistChoice) {
            addSongToPlaylist(songId, playlistChoice);
        }
        
        closeContextMenu();
    });
    
    document.getElementById('context-add-queue').addEventListener('click', () => {
        addToQueue(state.contextMenu.songId);
        closeContextMenu();
    });
    
    document.getElementById('context-play-next').addEventListener('click', () => {
        playNext(state.contextMenu.songId);
        closeContextMenu();
    });
    
    document.getElementById('context-remove-playlist').addEventListener('click', () => {
        if (state.contextMenu.type === 'recent-song') {
            removeSongFromRecent(state.contextMenu.songId);
        } else {
            deleteSongFromPlaylist(state.contextMenu.songId);
        }
        closeContextMenu();
    });
    
    document.getElementById('context-delete-song').addEventListener('click', () => {
        showToast('Song deletion from library not implemented', 'warning');
        closeContextMenu();
    });
    
    // Playlist options menu
    document.getElementById('playlist-edit').addEventListener('click', () => {
        showPlaylistModal(state.contextMenu.playlistId);
        closePlaylistContextMenu();
    });
    
    document.getElementById('playlist-delete').addEventListener('click', () => {
        deletePlaylist(state.contextMenu.playlistId);
        closePlaylistContextMenu();
    });
    
    // Modal controls
    document.getElementById('modal-close').addEventListener('click', closePlaylistModal);
    document.getElementById('modal-cancel').addEventListener('click', closePlaylistModal);
    document.getElementById('song-info-close').addEventListener('click', closeSongInfoModal);
    
    document.getElementById('modal-save').addEventListener('click', () => {
        const nameInput = document.getElementById('playlist-name-input');
        const error = document.getElementById('modal-error');
        const playlistName = nameInput.value.trim();
        
        const validation = validatePlaylistName(playlistName);
        if (!validation.valid) {
            error.textContent = validation.error;
            error.classList.add('active');
            return;
        }
        
        if (state.contextMenu.playlistId) {
            // Update existing playlist
            const playlist = state.playlists.find(p => p.id === state.contextMenu.playlistId);
            if (playlist) {
                playlist.name = playlistName;
                savePlaylists();
                updatePlaylists();
                if (state.currentPlaylist === playlist.id) {
                    openPlaylistDetail(playlist.id);
                }
                showToast('Playlist updated', 'success');
            }
        } else {
            // Create new playlist
            const newPlaylist = {
                id: Date.now(),
                name: playlistName,
                songs: [],
                color: getRandomColor()
            };
            state.playlists.push(newPlaylist);
            savePlaylists();
            updatePlaylists();
            showToast('Playlist created', 'success');
        }
        
        closePlaylistModal();
    });
    
    // Color picker
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
        });
    });
    
    // Prevent default context menu
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.song-item') || 
            e.target.closest('.now-playing-menu') || 
            e.target.closest('.card') ||
            e.target.closest('.search-result-item')) {
            return;
        }
        e.preventDefault();
    });
}

// ==============================================
// INITIALIZE APP WITH COMPLETE PERSISTENCE
// ==============================================
async function initApp() {
    try {
        showLoading();
        await initDB();
        await loadAllData();
        
        preloadImages();
        setupEventListeners();
        updateUI();
        
        audioPlayer.volume = state.volume;
        audioPlayer.autoplay = false;
        audioPlayer.preload = 'auto';
        
        // Restore last playback if available
        if (state.currentSong) {
            const song = musicLibrary.find(s => s.id === state.currentSong);
            if (song) {
                audioPlayer.src = song.file;
                updateNowPlayingInfo();
                updateMiniPlayer();
                updateMediaSession(song);
                miniPlayer.classList.remove('hidden');
                
                // If was playing, restore play state
                if (state.isPlaying) {
                    audioPlayer.play().catch(e => {
                        console.log('Auto-play prevented, user interaction required');
                        state.isPlaying = false;
                        updatePlayButtons();
                    });
                }
            }
        }
        
        showPage('home');
        hideLoading();
        
        console.log("App initialized successfully with complete persistence");
        
    } catch (error) {
        console.error("Failed to initialize app:", error);
        updateUI();
        showPage('home');
        hideLoading();
        showToast('Failed to initialize app', 'error');
    }
}

// Save all data on page unload
window.addEventListener('beforeunload', () => {
    if (state.currentSong) {
        state.currentTime = audioPlayer.currentTime;
    }
    saveAllData();
});

// Auto-save every 30 seconds
setInterval(() => {
    if (state.currentSong || state.playlists.length > 0) {
        saveAllData();
    }
}, 30000);

window.addEventListener('DOMContentLoaded', initApp);

// ==============================================
// MOBILE SUPPORT
// ==============================================
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
});

function handleSwipe(startX, endX, startY, endY) {
    const swipeThreshold = 50;
    const verticalThreshold = 30;
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    if (Math.abs(diffY) < verticalThreshold && Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0 && nowPlayingScreen.classList.contains('active')) {
            nowPlayingScreen.classList.remove('active');
        }
    }
}

// Mobile touch feedback
document.querySelectorAll('.player-btn, .mini-player-btn, .action-btn, .context-item').forEach(btn => {
    btn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    btn.addEventListener('touchend', function() {
        this.style.transform = '';
    });
});

// Handle long press for context menu on mobile
let touchTimer;
document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.song-item') || 
        e.target.closest('.card') || 
        e.target.closest('.now-playing-menu') ||
        e.target.closest('.search-result-item')) {
        
        const target = e.target.closest('.song-item, .card, .now-playing-menu, .search-result-item');
        if (target) {
            touchTimer = setTimeout(() => {
                let songId;
                if (target.classList.contains('song-item')) {
                    songId = target.querySelector('.song-delete-btn')?.dataset.songId;
                } else if (target.classList.contains('card')) {
                    // Handle card context menu
                    const songCard = target;
                    // You might need to store song ID in data attribute
                } else if (target.classList.contains('now-playing-menu')) {
                    showNowPlayingContextMenu(e);
                } else if (target.classList.contains('search-result-item')) {
                    // Handle search result context menu
                }
                
                if (songId) {
                    showContextMenu({
                        preventDefault: () => {},
                        stopPropagation: () => {},
                        clientX: e.touches[0].clientX,
                        clientY: e.touches[0].clientY
                    }, songId);
                }
            }, 500);
        }
    }
});

document.addEventListener('touchend', () => {
    clearTimeout(touchTimer);
});

document.addEventListener('touchmove', () => {
    clearTimeout(touchTimer);
});

// Add some CSS for mobile long press feedback
const style = document.createElement('style');
style.textContent = `
    .song-item:active, .card:active, .search-result-item:active {
        opacity: 0.7;
        transition: opacity 0.2s;
    }
`;
document.head.appendChild(style);
