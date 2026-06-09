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

    await header.openBooks();
    const books = new Books(page);
    await books.expectPageLoaded();

    await header.openFavourites();
    const favourites = new Favourites(page);
    await favourites.expectPageLoaded();

    await header.openRents();
    const rents = new Rents(page);
    await rents.expectPageLoaded();

    await header.openPurchases();
    const booksAvailableForPurchase = new BooksAvailableForPurchase(page);
    await booksAvailableForPurchase.expectPageLoaded();

    await header.openPersonalPurchases();
    const purchaseHistory = new PurchaseHistory(page);
    await purchaseHistory.expectPageLoaded();

    await header.openDashboard();
    const dashboard = new Dashboard(page);
    dashboard.expectPageLoaded();
}

export async function clickAndAssertAdminMenuItems(page) {
    const header = new Header(page);

    await header.openAdminPurchases();
    const adminPurchases = new AdminPurchases(page);
    await adminPurchases.expectPageLoaded();

    await header.openUsers();
    const users = new Users(page);
    await users.expectPageLoaded();
}