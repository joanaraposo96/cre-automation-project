import { Header } from "../../frontend/components/Header";
import { Books } from "../../frontend/pom/Books";
import { Favourites } from "../../frontend/pom/Favourites";
import { Rents } from "../../frontend/pom/Rents";
import { BooksAvailableForPurchase } from "../../frontend/pom/BooksAvailableForPurchase";
import { PurchaseHistory } from "../../frontend/pom/PurchaseHistory";
import { Dashboard } from "../../frontend/pom/Dashboard";
import { AdminPurchases } from "../../frontend/pom/AdminPurchases";
import { Users } from "../../frontend/pom/Users";

export async function clickAndAssertStudentMenuItems(page) {
    const header = new Header(page);
    const books = new Books(page);
    const favourites = new Favourites(page);
    const rents = new Rents(page);
    const booksAvailableForPurchase = new BooksAvailableForPurchase(page);
    const purchaseHistory = new PurchaseHistory(page);
    const dashboard = new Dashboard(page);

    await header.openBooks();

    await books.expectPageLoaded();

    await header.openFavourites();

    await favourites.expectPageLoaded();

    await header.openRents();

    await rents.expectPageLoaded();

    await header.openPurchases();

    await booksAvailableForPurchase.expectPageLoaded();

    await header.openPersonalPurchases();

    await purchaseHistory.expectPageLoaded();

    await header.openDashboard();

    await dashboard.expectPageLoaded();
}

export async function clickAndAssertAdminMenuItems(page) {
    const header = new Header(page);
    const adminPurchases = new AdminPurchases(page);
    const users = new Users(page);

    await header.openAdminPurchases();

    await adminPurchases.expectPageLoaded();

    await header.openUsers();
    
    await users.expectPageLoaded();
}