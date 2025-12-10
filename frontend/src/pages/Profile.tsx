import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileService } from "../services/ProfileService";
import { useAuth } from "../context/AuthContext";
import type { UserProfile, UpdateProfile, ChangePassword } from "../types";

export default function Profile() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState<UpdateProfile>({});
    const [passwordData, setPasswordData] = useState<ChangePassword>({
        currentPassword: "",
        newPassword: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const data = await ProfileService.getProfile();
                setProfile(data);
                setFormData({
                    fullName: data.fullName,
                    phone: data.phone,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                });
            } catch (err) {
                setError("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, navigate]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const updated = await ProfileService.updateProfile(formData);
            setProfile(updated);
            setIsEditing(false);
            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update profile"
            );
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (passwordData.newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            await ProfileService.changePassword(passwordData);
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: "", newPassword: "" });
            setConfirmPassword("");
            setSuccess("Password changed successfully!");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to change password"
            );
        }
    };

    if (isLoading) {
        return <div className="profile-page__loading">Loading profile...</div>;
    }

    if (!profile) {
        return (
            <div className="profile-page__error">Failed to load profile</div>
        );
    }

    return (
        <div className="profile-page">
            <h1>My Profile</h1>

            {error && (
                <div className="profile-page__alert profile-page__alert--error">
                    {error}
                </div>
            )}
            {success && (
                <div className="profile-page__alert profile-page__alert--success">
                    {success}
                </div>
            )}

            <div className="profile-page__content">
                <section className="profile-section">
                    <div className="profile-section__header">
                        <h2>Personal Information</h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="profile-section__edit"
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form
                            onSubmit={handleUpdateProfile}
                            className="profile-form"
                        >
                            <div className="profile-form__field">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={formData.fullName || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fullName: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="profile-form__field">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="profile-form__field">
                                <label htmlFor="address">Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    value={formData.address || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="profile-form__row">
                                <div className="profile-form__field">
                                    <label htmlFor="city">City</label>
                                    <input
                                        id="city"
                                        type="text"
                                        value={formData.city || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                city: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="profile-form__field">
                                    <label htmlFor="state">State</label>
                                    <input
                                        id="state"
                                        type="text"
                                        value={formData.state || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                state: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="profile-form__field">
                                    <label htmlFor="zipCode">ZIP Code</label>
                                    <input
                                        id="zipCode"
                                        type="text"
                                        value={formData.zipCode || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                zipCode: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="profile-form__actions">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="profile-form__submit"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="profile-info__item">
                                <span className="profile-info__label">
                                    Name
                                </span>
                                <span className="profile-info__value">
                                    {profile.fullName || "Not set"}
                                </span>
                            </div>
                            <div className="profile-info__item">
                                <span className="profile-info__label">
                                    Email
                                </span>
                                <span className="profile-info__value">
                                    {profile.email}
                                </span>
                            </div>
                            <div className="profile-info__item">
                                <span className="profile-info__label">
                                    Phone
                                </span>
                                <span className="profile-info__value">
                                    {profile.phone || "Not set"}
                                </span>
                            </div>
                            <div className="profile-info__item">
                                <span className="profile-info__label">
                                    Address
                                </span>
                                <span className="profile-info__value">
                                    {profile.address
                                        ? `${profile.address}, ${profile.city} - ${profile.state}, ${profile.zipCode}`
                                        : "Not set"}
                                </span>
                            </div>
                            <div className="profile-info__item">
                                <span className="profile-info__label">
                                    Member Since
                                </span>
                                <span className="profile-info__value">
                                    {profile.createdAt
                                        ? new Date(
                                              profile.createdAt
                                          ).toLocaleDateString("pt-BR")
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    )}
                </section>

                <section className="profile-section">
                    <div className="profile-section__header">
                        <h2>Security</h2>
                    </div>

                    {isChangingPassword ? (
                        <form
                            onSubmit={handleChangePassword}
                            className="profile-form"
                        >
                            <div className="profile-form__field">
                                <label htmlFor="currentPassword">
                                    Current Password
                                </label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            currentPassword: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="profile-form__field">
                                <label htmlFor="newPassword">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="profile-form__field">
                                <label htmlFor="confirmPassword">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="profile-form__actions">
                                <button
                                    type="button"
                                    onClick={() => setIsChangingPassword(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="profile-form__submit"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsChangingPassword(true)}
                            className="profile-section__action"
                        >
                            Change Password
                        </button>
                    )}
                </section>

                <section className="profile-section profile-section--danger">
                    <h2>Account Actions</h2>
                    <button
                        onClick={logout}
                        className="profile-section__logout"
                    >
                        Logout
                    </button>
                </section>
            </div>
        </div>
    );
}
