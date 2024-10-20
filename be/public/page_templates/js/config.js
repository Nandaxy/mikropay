const API_URL = "http://localhost:5000/"; // dibelakan ada / di akhir
const SLUG = "hn5stf"
const dnsMikrotik = "http://hs-pi.net/"; // dibelakan ada / di akhir 

// ------------------ Jangan di ubah -------
let vouchers = [];


const getVouchers = async () => {
    try {
        const respon = await fetch(`${API_URL}hotspot/profile/${SLUG}`);
        const voucherData = await respon.json();
        vouchers = voucherData.data;
        console.log(vouchers);
        
        if (vouchers && vouchers.length > 0) {
            createVoucherButtons();
        } else {
            console.error('No vouchers found.');
        }
    } catch (error) {
        console.error('Error fetching vouchers:', error);
    }
};

getVouchers();
